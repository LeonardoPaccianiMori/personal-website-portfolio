/**
 * Physics Engine for Wanderer
 * Implements N-body gravitational simulation with Leapfrog (Verlet) integration
 * Barnes-Hut O(N log N) gravity + Spatial hashing O(N) collisions + Dynamic trail scaling!
 * Version: 2025-11-22-v9
 */

/**
 * Blend two hex colors with random weights, ensuring brightness
 */
function blendColorsWeighted(color1, color2) {
    // Parse hex colors to RGB
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);

    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);

    // Random weight (biased toward 0.3-0.7 for better mixing)
    const weight = 0.3 + Math.random() * 0.4;

    // Blend
    let r = Math.round(r1 * weight + r2 * (1 - weight));
    let g = Math.round(g1 * weight + g2 * (1 - weight));
    let b = Math.round(b1 * weight + b2 * (1 - weight));

    // Ensure minimum brightness (safeguard against too dark)
    const minBrightness = 100; // Minimum per channel
    const brightness = (r + g + b) / 3;

    if (brightness < minBrightness) {
        // Brighten proportionally
        const factor = minBrightness / brightness;
        r = Math.min(255, Math.round(r * factor));
        g = Math.min(255, Math.round(g * factor));
        b = Math.min(255, Math.round(b * factor));
    }

    // Convert back to hex
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return '#' + toHex(r) + toHex(g) + toHex(b);
}

export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    mult(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    div(scalar) {
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    }

    magSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    mag() {
        return Math.sqrt(this.magSq());
    }

    normalize() {
        const m = this.mag();
        return m > 0 ? this.div(m) : new Vector3();
    }

    dist(v) {
        return this.sub(v).mag();
    }

    distSq(v) {
        return this.sub(v).magSq();
    }
}

/**
 * Octree Node for Barnes-Hut algorithm
 * Represents a cubic region of space that can contain bodies
 */
class OctreeNode {
    constructor(center, size) {
        this.center = center;      // Center of this cubic region
        this.size = size;          // Side length of the cube
        this.body = null;          // If leaf: the single body in this node
        this.totalMass = 0;        // Total mass of all bodies in this node
        this.centerOfMass = null;  // Center of mass of all bodies in this node
        this.children = null;      // Array of 8 children (if internal node)
        this.isLeaf = true;        // Whether this is a leaf node
    }

    /**
     * Check if a position is within this node's boundaries
     */
    contains(pos) {
        const halfSize = this.size / 2;
        return Math.abs(pos.x - this.center.x) <= halfSize &&
               Math.abs(pos.y - this.center.y) <= halfSize &&
               Math.abs(pos.z - this.center.z) <= halfSize;
    }

    /**
     * Insert a body into this node
     */
    insert(body) {
        // If this node doesn't contain the body, ignore it
        if (!this.contains(body.pos)) {
            return false;
        }

        // Case 1: Empty node - just add the body
        if (this.totalMass === 0) {
            this.body = body;
            this.totalMass = body.mass;
            this.centerOfMass = body.pos.clone();
            return true;
        }

        // Case 2: Leaf node with one body - subdivide and redistribute
        if (this.isLeaf) {
            const oldBody = this.body;
            this.body = null;
            this.isLeaf = false;
            this.subdivide();

            // Reinsert old body into children
            this.insertIntoChildren(oldBody);
        }

        // Case 3: Internal node - insert into appropriate child
        this.insertIntoChildren(body);

        // Update this node's center of mass and total mass
        const totalMass = this.totalMass + body.mass;
        this.centerOfMass = this.centerOfMass.mult(this.totalMass)
            .add(body.pos.mult(body.mass))
            .div(totalMass);
        this.totalMass = totalMass;

        return true;
    }

    /**
     * Create 8 children subdividing this node's space
     */
    subdivide() {
        this.children = [];
        const quarterSize = this.size / 4;
        const halfSize = this.size / 2;

        // Create 8 octants
        for (let i = 0; i < 8; i++) {
            const offsetX = (i & 1) ? quarterSize : -quarterSize;
            const offsetY = (i & 2) ? quarterSize : -quarterSize;
            const offsetZ = (i & 4) ? quarterSize : -quarterSize;

            const childCenter = new Vector3(
                this.center.x + offsetX,
                this.center.y + offsetY,
                this.center.z + offsetZ
            );

            this.children.push(new OctreeNode(childCenter, halfSize));
        }
    }

    /**
     * Insert a body into the appropriate child node
     */
    insertIntoChildren(body) {
        for (const child of this.children) {
            if (child.insert(body)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Calculate gravitational force on a body using Barnes-Hut approximation
     * theta: threshold for approximation (typically 0.5)
     * Lower theta = more accurate but slower
     */
    calculateForce(body, theta, gConst, gravExp) {
        // Empty node - no force
        if (this.totalMass === 0 || this.totalMass < 0.001) {
            return new Vector3();
        }

        const r = this.centerOfMass.sub(body.pos);
        const distSq = r.magSq();

        // Avoid self-interaction
        if (distSq < 0.01) {
            return new Vector3();
        }

        const dist = Math.sqrt(distSq);

        // If this is a leaf with a single body, or if the node is far enough away,
        // treat it as a single point mass
        if (this.isLeaf || (this.size / dist) < theta) {
            const forceMag = gConst * this.totalMass / Math.pow(dist, gravExp);
            return r.normalize().mult(forceMag);
        }

        // Otherwise, recursively calculate force from children
        let totalForce = new Vector3();
        if (this.children) {
            for (const child of this.children) {
                totalForce = totalForce.add(child.calculateForce(body, theta, gConst, gravExp));
            }
        }

        return totalForce;
    }
}

export class Body {
    constructor(pos, velocity, mass, radius, color) {
        this.pos = pos instanceof Vector3 ? pos : new Vector3();
        this.velocity = velocity instanceof Vector3 ? velocity : new Vector3();
        this.mass = mass || 1.0;
        this.radius = radius || 1.0;
        this.color = color || '#ffffff';
        this.id = Math.random().toString(36).substr(2, 9);
        this.trail = [];
    }

    clone() {
        const body = new Body(
            this.pos.clone(),
            this.velocity.clone(),
            this.mass,
            this.radius,
            this.color
        );
        body.id = this.id;
        return body;
    }

    updateTrail(showTrails, maxTrailLength = 500) {
        if (!showTrails) {
            this.trail = [];
            return;
        }

        this.trail.push(this.pos.clone());

        // Dynamically limit trail length based on body count
        if (this.trail.length > maxTrailLength) {
            this.trail.shift();
        }
    }
}

export class PhysicsEngine {
    constructor() {
        this.bodies = [];
        this.gConst = 1.0;  // Gravitational constant
        this.gravExp = 2.0; // Gravity exponent (2.0 = inverse square law)
        this.dt = 0.016;    // Time step (60 FPS)
        this.paused = false;
        this.showTrails = true;
        this.timeScale = 1.0; // Time scale multiplier (0.1 to 100)
        this.theta = 0.5;   // Barnes-Hut approximation threshold (lower = more accurate, higher = faster)
        this.useBarnesHut = true; // Toggle Barnes-Hut algorithm (set to false for brute force)
    }

    addBody(body) {
        this.bodies.push(body);
    }

    removeBody(body) {
        const index = this.bodies.indexOf(body);
        if (index > -1) {
            this.bodies.splice(index, 1);
        }
    }

    removeBodyById(id) {
        const index = this.bodies.findIndex(b => b.id === id);
        if (index > -1) {
            this.bodies.splice(index, 1);
        }
    }

    clear() {
        this.bodies = [];
    }

    /**
     * Build octree from current bodies
     * Returns the root node of the octree
     */
    buildOctree() {
        if (this.bodies.length === 0) {
            return null;
        }

        // Find bounding box of all bodies
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

        for (const body of this.bodies) {
            minX = Math.min(minX, body.pos.x);
            minY = Math.min(minY, body.pos.y);
            minZ = Math.min(minZ, body.pos.z);
            maxX = Math.max(maxX, body.pos.x);
            maxY = Math.max(maxY, body.pos.y);
            maxZ = Math.max(maxZ, body.pos.z);
        }

        // Create root node with padding to ensure all bodies fit
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;
        const center = new Vector3(centerX, centerY, centerZ);

        // Size is the maximum extent plus some padding
        const size = Math.max(
            maxX - minX,
            maxY - minY,
            maxZ - minZ
        ) * 1.2; // 20% padding

        const root = new OctreeNode(center, size);

        // Insert all bodies into the octree
        for (const body of this.bodies) {
            root.insert(body);
        }

        return root;
    }

    /**
     * Calculate gravitational acceleration on a body
     * Uses Barnes-Hut algorithm if enabled, otherwise brute force
     */
    calculateAcceleration(body, octree = null) {
        // Barnes-Hut algorithm
        if (this.useBarnesHut && octree) {
            return octree.calculateForce(body, this.theta, this.gConst, this.gravExp);
        }

        // Brute force (fallback)
        let acc = new Vector3();

        for (const other of this.bodies) {
            if (body === other) continue;

            const r = other.pos.sub(body.pos);
            const distSq = r.magSq();

            if (distSq < 0.01) continue; // Avoid singularity

            const dist = Math.sqrt(distSq);
            const forceMag = this.gConst * other.mass / Math.pow(dist, this.gravExp);
            const forceDir = r.normalize();

            acc = acc.add(forceDir.mult(forceMag));
        }

        return acc;
    }

    /**
     * Leapfrog (Verlet) integration - kick-drift-kick form
     * Symplectic integrator that conserves energy and is very stable
     * for orbital mechanics, even at high time scales
     */
    integrateLeapfrog(dt) {
        const n = this.bodies.length;
        const accelerations = [];

        // Build octree for initial positions (if using Barnes-Hut)
        let octree = this.useBarnesHut ? this.buildOctree() : null;

        // Calculate initial accelerations
        for (let i = 0; i < n; i++) {
            accelerations[i] = this.calculateAcceleration(this.bodies[i], octree);
        }

        // Kick: Update velocities by half step
        for (let i = 0; i < n; i++) {
            this.bodies[i].velocity = this.bodies[i].velocity.add(accelerations[i].mult(dt * 0.5));
        }

        // Drift: Update positions by full step
        for (let i = 0; i < n; i++) {
            this.bodies[i].pos = this.bodies[i].pos.add(this.bodies[i].velocity.mult(dt));
        }

        // Rebuild octree for new positions
        octree = this.useBarnesHut ? this.buildOctree() : null;

        // Recalculate accelerations at new positions
        for (let i = 0; i < n; i++) {
            accelerations[i] = this.calculateAcceleration(this.bodies[i], octree);
        }

        // Kick: Update velocities by half step again
        for (let i = 0; i < n; i++) {
            this.bodies[i].velocity = this.bodies[i].velocity.add(accelerations[i].mult(dt * 0.5));
        }
    }

    /**
     * Detect and handle collisions between bodies using spatial hashing
     * @param {string|null} followedPlanetId - ID of the planet being followed (if any)
     */
    handleCollisions(followedPlanetId = null) {
        if (this.bodies.length === 0) return;

        const toRemove = new Set();
        const toAdd = [];

        // Use spatial hashing for faster collision detection
        // Grid cell size is 2x the largest body radius
        const maxRadius = Math.max(...this.bodies.map(b => b.radius));
        const cellSize = maxRadius * 4; // Use 4x to account for both radii

        // Hash function to convert position to grid cell
        const hash = (x, y, z) => {
            const cx = Math.floor(x / cellSize);
            const cy = Math.floor(y / cellSize);
            const cz = Math.floor(z / cellSize);
            return `${cx},${cy},${cz}`;
        };

        // Build spatial hash grid
        const grid = new Map();
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i];
            const key = hash(body.pos.x, body.pos.y, body.pos.z);
            if (!grid.has(key)) {
                grid.set(key, []);
            }
            grid.get(key).push(i);
        }

        // Check collisions only within same or neighboring cells
        const checked = new Set();

        for (let i = 0; i < this.bodies.length; i++) {
            if (toRemove.has(i)) continue;

            const b1 = this.bodies[i];
            const cx = Math.floor(b1.pos.x / cellSize);
            const cy = Math.floor(b1.pos.y / cellSize);
            const cz = Math.floor(b1.pos.z / cellSize);

            // Check this cell and all 26 neighboring cells
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dz = -1; dz <= 1; dz++) {
                        const neighborKey = `${cx+dx},${cy+dy},${cz+dz}`;
                        const neighbors = grid.get(neighborKey);

                        if (!neighbors) continue;

                        for (const j of neighbors) {
                            if (i >= j) continue; // Avoid duplicate checks
                            if (toRemove.has(j)) continue;

                            const pairKey = `${i},${j}`;
                            if (checked.has(pairKey)) continue;
                            checked.add(pairKey);

                            const b2 = this.bodies[j];
                            const distSq = b1.pos.distSq(b2.pos);
                            const minDist = b1.radius + b2.radius;

                            if (distSq < minDist * minDist) {
                                // Collision detected - merge bodies
                                const totalMass = b1.mass + b2.mass;
                                const newPos = b1.pos.mult(b1.mass).add(b2.pos.mult(b2.mass)).div(totalMass);
                                const newVel = b1.velocity.mult(b1.mass).add(b2.velocity.mult(b2.mass)).div(totalMass);

                                // New radius based on volume conservation
                                const newRadius = Math.pow(
                                    Math.pow(b1.radius, 3) + Math.pow(b2.radius, 3),
                                    1/3
                                );

                                // Blend colors
                                const blendedColor = blendColorsWeighted(b1.color, b2.color);
                                const merged = new Body(newPos, newVel, totalMass, newRadius, blendedColor);

                                // Preserve ID priority
                                let preservedId;
                                if (followedPlanetId && (b1.id === followedPlanetId || b2.id === followedPlanetId)) {
                                    preservedId = followedPlanetId;
                                } else {
                                    preservedId = b1.mass >= b2.mass ? b1.id : b2.id;
                                }
                                merged.id = preservedId;

                                toAdd.push(merged);
                                toRemove.add(i);
                                toRemove.add(j);
                                break;
                            }
                        }
                        if (toRemove.has(i)) break;
                    }
                    if (toRemove.has(i)) break;
                }
                if (toRemove.has(i)) break;
            }
        }

        // Remove collided bodies
        const indices = Array.from(toRemove).sort((a, b) => b - a);
        for (const idx of indices) {
            this.bodies.splice(idx, 1);
        }

        // Add merged bodies
        for (const body of toAdd) {
            this.bodies.push(body);
        }
    }

    /**
     * Calculate center of mass
     */
    getCenterOfMass() {
        if (this.bodies.length === 0) return new Vector3();

        let totalMass = 0;
        let com = new Vector3();

        for (const body of this.bodies) {
            com = com.add(body.pos.mult(body.mass));
            totalMass += body.mass;
        }

        return totalMass > 0 ? com.div(totalMass) : new Vector3();
    }

    /**
     * Calculate total energy (kinetic + potential)
     */
    getTotalEnergy() {
        let kinetic = 0;
        let potential = 0;

        // Kinetic energy
        for (const body of this.bodies) {
            kinetic += 0.5 * body.mass * body.velocity.magSq();
        }

        // Potential energy
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const b1 = this.bodies[i];
                const b2 = this.bodies[j];
                const dist = b1.pos.dist(b2.pos);
                if (dist > 0.01) {
                    potential -= this.gConst * b1.mass * b2.mass / dist;
                }
            }
        }

        return kinetic + potential;
    }

    /**
     * Main physics update step
     * @param {string|null} followedPlanetId - ID of the planet being followed (if any)
     */
    update(followedPlanetId = null) {
        if (this.paused || this.bodies.length === 0) return;

        // Calculate substeps to maintain stability at high time scales
        // Use substeps = timeScale, so each substep is always dt (same as 1x)
        // This guarantees perfect stability regardless of time scale
        const substeps = Math.ceil(this.timeScale);
        const substepDt = this.dt; // Always use base dt for maximum stability

        // Throttle trail updates to maintain performance at high time scales
        // Add a trail point every N substeps where N scales with timeScale
        const trailUpdateInterval = Math.max(1, Math.floor(this.timeScale / 10));

        // Dynamic trail length based on body count to maintain performance
        // Target: ~30,000 total vertices for good FPS even with many bodies
        const numBodies = this.bodies.length;
        const maxTrailLength = Math.max(20, Math.min(500, Math.floor(30000 / numBodies)));

        // Run integration multiple times with smaller steps
        for (let step = 0; step < substeps; step++) {
            this.integrateLeapfrog(substepDt);

            // Handle collisions after each substep, passing followed planet ID
            this.handleCollisions(followedPlanetId);

            // Update trails periodically (not every substep at high time scales)
            if (step % trailUpdateInterval === 0) {
                for (const body of this.bodies) {
                    body.updateTrail(this.showTrails, maxTrailLength);
                }
            }
        }
    }

    togglePause() {
        this.paused = !this.paused;
        return this.paused;
    }

    toggleTrails() {
        this.showTrails = !this.showTrails;
        if (!this.showTrails) {
            for (const body of this.bodies) {
                body.trail = [];
            }
        }
        return this.showTrails;
    }

    increaseTimeScale() {
        const scales = [0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
        const currentIndex = scales.findIndex(s => s >= this.timeScale);
        if (currentIndex < scales.length - 1) {
            this.timeScale = scales[currentIndex + 1];
        }
        return this.timeScale;
    }

    decreaseTimeScale() {
        const scales = [0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
        const currentIndex = scales.findIndex(s => s >= this.timeScale);
        if (currentIndex > 0) {
            this.timeScale = scales[currentIndex - 1];
        }
        return this.timeScale;
    }

    resetTimeScale() {
        this.timeScale = 1.0;
        return this.timeScale;
    }
}
