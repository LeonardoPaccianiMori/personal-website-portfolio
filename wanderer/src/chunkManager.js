/**
 * Chunk Manager - Procedural generation for infinite universe
 * Generates reference cubes in chunks around the camera
 */

import * as THREE from 'three';

/**
 * Seeded random number generator for deterministic chunk generation
 */
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    // LCG (Linear Congruential Generator) algorithm
    next() {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }
}

/**
 * Hash function to convert chunk coordinates to a seed
 */
function hashChunkCoords(x, y, z) {
    // Simple hash combining the three coordinates
    let hash = 0;
    hash = ((hash << 5) - hash) + x;
    hash = ((hash << 5) - hash) + y;
    hash = ((hash << 5) - hash) + z;
    return Math.abs(hash);
}

export class ChunkManager {
    constructor(scene) {
        this.scene = scene;
        this.chunkSize = 100;  // Size of each chunk in world units
        this.loadRadius = 2;   // How many chunks to load in each direction
        this.cubesPerChunk = 40; // Number of reference cubes per chunk

        this.loadedChunks = new Map(); // Map of "x,y,z" -> chunk data
        this.currentCameraChunk = null;
    }

    /**
     * Get chunk coordinates for a world position
     */
    getChunkCoords(worldPos) {
        return {
            x: Math.floor(worldPos.x / this.chunkSize),
            y: Math.floor(worldPos.y / this.chunkSize),
            z: Math.floor(worldPos.z / this.chunkSize)
        };
    }

    /**
     * Create a unique key for chunk coordinates
     */
    getChunkKey(cx, cy, cz) {
        return `${cx},${cy},${cz}`;
    }

    /**
     * Generate reference cubes for a specific chunk
     */
    generateChunk(cx, cy, cz) {
        const seed = hashChunkCoords(cx, cy, cz);
        const rng = new SeededRandom(seed);

        const cubes = [];
        const chunkWorldX = cx * this.chunkSize;
        const chunkWorldY = cy * this.chunkSize;
        const chunkWorldZ = cz * this.chunkSize;

        // Shared geometry and material for efficiency
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });

        for (let i = 0; i < this.cubesPerChunk; i++) {
            const cube = new THREE.Mesh(geometry, material);

            // Random position within this chunk
            cube.position.set(
                chunkWorldX + rng.next() * this.chunkSize,
                chunkWorldY + rng.next() * this.chunkSize,
                chunkWorldZ + rng.next() * this.chunkSize
            );

            // Random rotation
            cube.rotation.set(
                rng.next() * Math.PI,
                rng.next() * Math.PI,
                rng.next() * Math.PI
            );

            // Random scale for variety
            const scale = 0.3 + rng.next() * 0.7;
            cube.scale.set(scale, scale, scale);

            this.scene.add(cube);
            cubes.push(cube);
        }

        return {
            coords: { x: cx, y: cy, z: cz },
            cubes: cubes,
            geometry: geometry,
            material: material
        };
    }

    /**
     * Remove a chunk and clean up its objects
     */
    unloadChunk(chunkKey) {
        const chunk = this.loadedChunks.get(chunkKey);
        if (!chunk) return;

        // Remove all cubes from scene
        for (const cube of chunk.cubes) {
            this.scene.remove(cube);
        }

        // Dispose geometry and material
        chunk.geometry.dispose();
        chunk.material.dispose();

        this.loadedChunks.delete(chunkKey);
    }

    /**
     * Update loaded chunks based on camera position
     */
    update(cameraPosition) {
        const cameraChunk = this.getChunkCoords(cameraPosition);
        const { x: cx, y: cy, z: cz } = cameraChunk;

        // Check if camera moved to a new chunk
        const currentKey = this.getChunkKey(cx, cy, cz);
        if (this.currentCameraChunk === currentKey) {
            return; // Still in same chunk, no update needed
        }

        this.currentCameraChunk = currentKey;

        // Determine which chunks should be loaded
        const chunksToLoad = new Set();
        for (let dx = -this.loadRadius; dx <= this.loadRadius; dx++) {
            for (let dy = -this.loadRadius; dy <= this.loadRadius; dy++) {
                for (let dz = -this.loadRadius; dz <= this.loadRadius; dz++) {
                    const key = this.getChunkKey(cx + dx, cy + dy, cz + dz);
                    chunksToLoad.add(key);
                }
            }
        }

        // Unload chunks that are too far away
        for (const [key, chunk] of this.loadedChunks) {
            if (!chunksToLoad.has(key)) {
                this.unloadChunk(key);
            }
        }

        // Load new chunks that aren't loaded yet
        for (const key of chunksToLoad) {
            if (!this.loadedChunks.has(key)) {
                const [x, y, z] = key.split(',').map(Number);
                const chunk = this.generateChunk(x, y, z);
                this.loadedChunks.set(key, chunk);
            }
        }
    }

    /**
     * Initial load of chunks around origin
     */
    initialize() {
        const origin = new THREE.Vector3(0, 0, 0);
        this.update(origin);
    }

    /**
     * Clear all loaded chunks
     */
    clear() {
        const keys = Array.from(this.loadedChunks.keys());
        for (const key of keys) {
            this.unloadChunk(key);
        }
        this.currentCameraChunk = null;
    }
}
