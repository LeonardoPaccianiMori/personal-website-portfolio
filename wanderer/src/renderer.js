/**
 * Renderer - Handles Three.js scene, camera, and rendering
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ChunkManager } from './chunkManager.js';

export class Renderer {
    constructor(container) {
        this.container = container;
        this.bodyMeshes = new Map(); // Map body.id -> mesh
        this.trailLines = new Map(); // Map body.id -> line

        this.initScene();
        this.initLights();
        this.initControls();
        this.initChunkManager();
    }

    initScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 20, 40);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Raycaster for mouse picking
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    initLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Point light at origin
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);

        // Hemisphere light for better overall illumination
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
        this.scene.add(hemiLight);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 200;
        this.controls.maxPolarAngle = Math.PI;
    }

    initChunkManager() {
        // Initialize procedural chunk-based generation for infinite universe
        this.chunkManager = new ChunkManager(this.scene);
        this.chunkManager.initialize();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Create or update mesh for a body
     */
    updateBody(body) {
        let mesh = this.bodyMeshes.get(body.id);

        if (!mesh) {
            // Create new mesh
            const geometry = new THREE.SphereGeometry(body.radius, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: body.color,
                emissive: body.color,
                emissiveIntensity: 0.2,
                shininess: 30
            });
            mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);
            this.bodyMeshes.set(body.id, mesh);
        }

        // Update position
        mesh.position.set(body.pos.x, body.pos.y, body.pos.z);

        // Update scale if radius changed (for merged bodies)
        const currentRadius = mesh.geometry.parameters.radius;
        if (Math.abs(currentRadius - body.radius) > 0.01) {
            const scale = body.radius / currentRadius;
            mesh.scale.set(scale, scale, scale);
        }
    }

    /**
     * Update trail for a body with distance-based culling
     */
    updateTrail(body, maxTrailDistance = 100) {
        let line = this.trailLines.get(body.id);

        // Calculate distance from camera to body
        const cameraPos = this.camera.position;
        const dx = body.pos.x - cameraPos.x;
        const dy = body.pos.y - cameraPos.y;
        const dz = body.pos.z - cameraPos.z;
        const distanceToCamera = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // If body is too far from camera, hide its trail
        if (distanceToCamera > maxTrailDistance) {
            if (line) {
                line.visible = false;
            }
            return;
        }

        // Body is close enough - show trail
        if (body.trail.length < 2) {
            // Remove line if trail is too short
            if (line) {
                this.scene.remove(line);
                this.trailLines.delete(body.id);
            }
            return;
        }

        const points = body.trail.map(p => new THREE.Vector3(p.x, p.y, p.z));

        if (!line) {
            // Create new line
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: body.color,
                opacity: 0.6,
                transparent: true,
                depthWrite: false  // Prevent z-fighting and depth issues
            });
            line = new THREE.Line(geometry, material);
            line.frustumCulled = false; // Prevent trails from disappearing when zoomed
            line.renderOrder = -1; // Render trails before planets
            this.scene.add(line);
            this.trailLines.set(body.id, line);
        } else {
            // Update existing line
            line.visible = true; // Make sure it's visible
            line.geometry.setFromPoints(points);
            line.geometry.attributes.position.needsUpdate = true;
            line.geometry.computeBoundingSphere(); // Ensure bounding sphere is recalculated
        }
    }

    /**
     * Remove mesh for deleted body
     */
    removeBody(bodyId) {
        const mesh = this.bodyMeshes.get(bodyId);
        if (mesh) {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.bodyMeshes.delete(bodyId);
        }

        const line = this.trailLines.get(bodyId);
        if (line) {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
            this.trailLines.delete(bodyId);
        }
    }

    /**
     * Clear all bodies from scene
     */
    clearBodies() {
        for (const [id, mesh] of this.bodyMeshes) {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        }
        this.bodyMeshes.clear();

        for (const [id, line] of this.trailLines) {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
        }
        this.trailLines.clear();
    }

    /**
     * Render the scene
     */
    render(bodies) {
        // Track which bodies exist
        const currentBodyIds = new Set(bodies.map(b => b.id));

        // Remove meshes for deleted bodies
        for (const id of this.bodyMeshes.keys()) {
            if (!currentBodyIds.has(id)) {
                this.removeBody(id);
            }
        }

        // Update or create meshes for current bodies
        for (const body of bodies) {
            this.updateBody(body);
            this.updateTrail(body);
        }

        // Update chunks based on camera position for infinite universe
        this.chunkManager.update(this.camera.position);

        // Update controls and render
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Get 3D position from mouse click
     */
    getMousePosition(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        return this.mouse;
    }

    /**
     * Cast ray from mouse position and get 3D point on plane
     */
    getWorldPosition(event, distance = 30) {
        this.getMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Create a plane perpendicular to camera
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        const plane = new THREE.Plane(cameraDirection, -distance);

        const intersection = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, intersection);

        return intersection;
    }

    /**
     * Find body at mouse position
     */
    getBodyAtMouse(event, bodies) {
        this.getMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const meshes = bodies.map(b => this.bodyMeshes.get(b.id)).filter(m => m);
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            // Find body by mesh
            for (const body of bodies) {
                if (this.bodyMeshes.get(body.id) === mesh) {
                    return body;
                }
            }
        }

        return null;
    }

    /**
     * Center camera on position
     */
    centerOn(position) {
        this.controls.target.set(position.x, position.y, position.z);
        this.controls.update();
    }

    /**
     * Reset camera to default position
     */
    resetCamera() {
        this.camera.position.set(0, 20, 40);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    /**
     * Create preview sphere for planet placement
     */
    createPreviewSphere(position, radius, color) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.6
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        this.scene.add(mesh);
        return mesh;
    }

    /**
     * Remove preview sphere
     */
    removePreviewSphere(mesh) {
        if (mesh) {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        }
    }

    /**
     * Create velocity arrow for visualization
     */
    createVelocityArrow(from, to, color) {
        const dir = new THREE.Vector3().subVectors(to, from);
        const length = dir.length();

        if (length < 0.1) return null;

        const arrowHelper = new THREE.ArrowHelper(
            dir.normalize(),
            from,
            length,
            color,
            length * 0.2,
            length * 0.1
        );
        this.scene.add(arrowHelper);
        return arrowHelper;
    }

    /**
     * Remove velocity arrow
     */
    removeVelocityArrow(arrow) {
        if (arrow) {
            this.scene.remove(arrow);
            arrow.dispose();
        }
    }
}
