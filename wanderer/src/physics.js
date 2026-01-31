/**
 * Physics Engine for Wanderer
 * Implements N-body gravitational simulation with Leapfrog (Verlet) integration
 * Brute-force gravity + Spatial hashing collisions + Dynamic trail scaling!
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

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    dist(v) {
        return this.sub(v).mag();
    }
}

export class Body {
    constructor(pos, velocity, mass, radius, color, spinAxis = null, spinRate = 0, spinAngle = 0) {
        this.pos = pos instanceof Vector3 ? pos : new Vector3();
        this.velocity = velocity instanceof Vector3 ? velocity : new Vector3();
        this.mass = mass || 1.0;
        this.radius = radius || 1.0;
        this.color = color || '#ffffff';
        this.id = Math.random().toString(36).substr(2, 9);
        this.trail = [];

        const axis = spinAxis instanceof Vector3 ? spinAxis.clone() : new Vector3(0, 1, 0);
        this.spinAxis = axis.magSq() > 0 ? axis.normalize() : new Vector3(0, 1, 0);
        this.spinRate = Math.max(0, spinRate || 0);
        this.spinAngle = spinAngle || 0;
        this.k2 = 0.3;
        this.tidalLag = 0.5;
        this.tidalStrength = 10.0;
        this.obliquityAlignRate = 0.03;
        this.axes = { a: this.radius, b: this.radius, c: this.radius };
        this.axisX = new Vector3(1, 0, 0);
        this.axisY = new Vector3(0, 1, 0);
        this.axisZ = new Vector3(0, 0, 1);
        this.inertiaDiag = new Vector3();
        this.quadDiag = new Vector3();
        this.maxExtent = this.radius;
        this.tideAxis = new Vector3(1, 0, 0);
        this.updateInertia();
    }

    updateInertia() {
        if (this.axes) {
            const a = this.axes.a;
            const b = this.axes.b;
            const c = this.axes.c;
            const Ixx = 0.2 * this.mass * (b * b + c * c);
            const Iyy = 0.2 * this.mass * (a * a + b * b);
            const Izz = 0.2 * this.mass * (a * a + c * c);
            this.inertiaDiag = new Vector3(Ixx, Iyy, Izz);
            this.momentOfInertia = Iyy;
        } else {
            this.momentOfInertia = 0.4 * this.mass * this.radius * this.radius;
            this.inertiaDiag = new Vector3(this.momentOfInertia, this.momentOfInertia, this.momentOfInertia);
        }
    }

    updateTrail(showTrails, maxTrailLength = 500, referenceOffset = null) {
        if (!showTrails) {
            this.trail = [];
            return;
        }

        // Store trail points in the chosen reference frame.
        const offset = referenceOffset || new Vector3();
        this.trail.push(this.pos.sub(offset));

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
        this.maxSpinRate = 2.0; // Clamp to avoid extreme spin
        this.useQuadrupole = true;
        this.maxFlattening = 0.5;
        this.minAxisRatio = 0.5;
        this.flatteningOmegaMax = 5.0;
        this.flatteningExponent = 0.7;
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

    clear() {
        this.bodies = [];
    }

    getSupportRadius(body, direction) {
        if (!body.axes || !body.axisX || !body.axisY || !body.axisZ) {
            return body.radius;
        }

        const dir = direction.magSq() > 0 ? direction.normalize() : new Vector3(1, 0, 0);
        const dx = body.axisX.dot(dir);
        const dy = body.axisY.dot(dir);
        const dz = body.axisZ.dot(dir);
        const a = body.axes.a;
        const b = body.axes.b;
        const c = body.axes.c;

        const denom = (dx * dx) / (a * a) + (dy * dy) / (c * c) + (dz * dz) / (b * b);
        if (denom <= 0) return body.radius;
        return 1 / Math.sqrt(denom);
    }

    tensorMultiply(t, v) {
        return new Vector3(
            t.xx * v.x + t.xy * v.y + t.xz * v.z,
            t.xy * v.x + t.yy * v.y + t.yz * v.z,
            t.xz * v.x + t.yz * v.y + t.zz * v.z
        );
    }

    dominantEigenvector(tensor, seed) {
        let v = seed && seed.magSq() > 0 ? seed.normalize() : new Vector3(1, 0, 0);
        for (let i = 0; i < 5; i++) {
            const tv = this.tensorMultiply(tensor, v);
            const mag = tv.mag();
            if (mag < 1e-9) {
                return v;
            }
            v = tv.div(mag);
        }
        return v;
    }

    getPerpendicularAxis(axis) {
        const up = Math.abs(axis.y) < 0.9 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0);
        const perp = up.cross(axis);
        return perp.magSq() > 0 ? perp.normalize() : new Vector3(1, 0, 0);
    }

    updateBodyShapes() {
        const n = this.bodies.length;
        if (n === 0) return;

        // Estimate tidal tensor field to derive deformation axes.
        const tensors = Array.from({ length: n }, () => ({
            xx: 0,
            xy: 0,
            xz: 0,
            yy: 0,
            yz: 0,
            zz: 0
        }));

        const eps = 1e-9;

        // Symmetric pairwise gravity with optional quadrupole correction.
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const bi = this.bodies[i];
                const bj = this.bodies[j];
                const r = bj.pos.sub(bi.pos);
                const distSq = r.magSq();
                if (distSq < eps) continue;

                const dist = Math.sqrt(distSq);
                const invDist = 1 / dist;
                const invDist3 = invDist * invDist * invDist;
                const nx = r.x * invDist;
                const ny = r.y * invDist;
                const nz = r.z * invDist;

                const nn_xx = nx * nx;
                const nn_xy = nx * ny;
                const nn_xz = nx * nz;
                const nn_yy = ny * ny;
                const nn_yz = ny * nz;
                const nn_zz = nz * nz;

                const txx = 3 * nn_xx - 1;
                const txy = 3 * nn_xy;
                const txz = 3 * nn_xz;
                const tyy = 3 * nn_yy - 1;
                const tyz = 3 * nn_yz;
                const tzz = 3 * nn_zz - 1;

                const factorI = this.gConst * bj.mass * invDist3;
                const factorJ = this.gConst * bi.mass * invDist3;

                const Ti = tensors[i];
                Ti.xx += factorI * txx;
                Ti.xy += factorI * txy;
                Ti.xz += factorI * txz;
                Ti.yy += factorI * tyy;
                Ti.yz += factorI * tyz;
                Ti.zz += factorI * tzz;

                const Tj = tensors[j];
                Tj.xx += factorJ * txx;
                Tj.xy += factorJ * txy;
                Tj.xz += factorJ * txz;
                Tj.yy += factorJ * tyy;
                Tj.yz += factorJ * tyz;
                Tj.zz += factorJ * tzz;
            }
        }

        for (let i = 0; i < n; i++) {
            const body = this.bodies[i];
            const tensor = tensors[i];
            const mass = Math.max(body.mass, eps);
            const baseRadius = body.radius;

            let spinAxis = body.spinAxis && body.spinAxis.magSq() > 0
                ? body.spinAxis.normalize()
                : new Vector3(0, 1, 0);
            body.spinAxis = spinAxis;

            let tideAxis = this.dominantEigenvector(tensor, body.tideAxis);
            const lambda = tideAxis.dot(this.tensorMultiply(tensor, tideAxis));
            if (!isFinite(lambda) || Math.abs(lambda) < 1e-9) {
                tideAxis = this.getPerpendicularAxis(spinAxis);
            }

            let axisX = tideAxis.sub(spinAxis.mult(spinAxis.dot(tideAxis)));
            if (axisX.magSq() < eps) {
                axisX = this.getPerpendicularAxis(spinAxis);
            } else {
                axisX = axisX.normalize();
            }

            const axisY = spinAxis;
            const axisZ = axisX.cross(axisY).normalize();

            body.axisX = axisX;
            body.axisY = axisY;
            body.axisZ = axisZ;
            body.tideAxis = axisX;

            const omegaRatio = this.flatteningOmegaMax > 0
                ? clamp(body.spinRate / this.flatteningOmegaMax, 0, 1)
                : 0;
            const fRot = this.maxFlattening * Math.pow(omegaRatio, this.flatteningExponent);
            const a0 = baseRadius * Math.pow(1 - fRot, -1 / 3);
            const b0 = a0;
            const c0 = a0 * (1 - fRot);

            const lambdaClamped = Math.max(0, lambda);
            const fTide = clamp(
                body.k2 * body.tidalStrength * lambdaClamped * Math.pow(baseRadius, 3) / (this.gConst * mass),
                0,
                this.maxFlattening
            );

            let a = a0 * (1 + fTide);
            let b = b0 * (1 - fTide / 2);
            let c = c0 * (1 - fTide / 2);

            const minAxis = this.minAxisRatio * baseRadius;
            const minCurrent = Math.min(a, b, c);
            if (minCurrent < minAxis && minCurrent > 0) {
                const scale = minAxis / minCurrent;
                a *= scale;
                b *= scale;
                c *= scale;
            }

            body.axes = { a, b, c };
            body.maxExtent = Math.max(a, b, c);

            const Ixx = 0.2 * body.mass * (b * b + c * c);
            const Iyy = 0.2 * body.mass * (a * a + b * b);
            const Izz = 0.2 * body.mass * (a * a + c * c);
            body.inertiaDiag = new Vector3(Ixx, Iyy, Izz);
            body.momentOfInertia = Iyy;

            const Qxx = (body.mass / 5) * (2 * a * a - b * b - c * c);
            const Qyy = (body.mass / 5) * (2 * c * c - a * a - b * b);
            const Qzz = (body.mass / 5) * (2 * b * b - a * a - c * c);
            body.quadDiag = new Vector3(Qxx, Qyy, Qzz);
        }
    }

    calculateQuadrupoleAccel(source, r) {
        if (!source.quadDiag || !source.axisX || !source.axisY || !source.axisZ) {
            return new Vector3();
        }

        const distSq = r.magSq();
        if (distSq < 1e-9) return new Vector3();
        const dist = Math.sqrt(distSq);
        const invDist = 1 / dist;
        const invDist2 = 1 / distSq;
        const invDist5 = invDist * invDist2 * invDist2;
        const invDist7 = invDist5 * invDist2;

        const x = source.axisX.dot(r);
        const y = source.axisY.dot(r);
        const z = source.axisZ.dot(r);

        const Qxx = source.quadDiag.x;
        const Qyy = source.quadDiag.y;
        const Qzz = source.quadDiag.z;

        const qx = Qxx * x;
        const qy = Qyy * y;
        const qz = Qzz * z;

        const rTQr = Qxx * x * x + Qyy * y * y + Qzz * z * z;

        const Qr = source.axisX.mult(qx).add(source.axisY.mult(qy)).add(source.axisZ.mult(qz));
        const term1 = Qr.mult(this.gConst * invDist5);
        const term2 = r.mult(this.gConst * 2.5 * rTQr * invDist7);
        return term1.sub(term2);
    }

    computeAccelerations() {
        const n = this.bodies.length;
        const accelerations = new Array(n);
        for (let i = 0; i < n; i++) {
            accelerations[i] = new Vector3();
        }

        const eps = 1e-9;

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const b1 = this.bodies[i];
                const b2 = this.bodies[j];
                const r = b2.pos.sub(b1.pos);
                const distSq = r.magSq();
                if (distSq < eps) continue;

                const dist = Math.sqrt(distSq);
                const dir = r.div(dist);
                const accelMag1 = this.gConst * b2.mass / Math.pow(dist, this.gravExp);
                const accelMag2 = this.gConst * b1.mass / Math.pow(dist, this.gravExp);

                accelerations[i] = accelerations[i].add(dir.mult(accelMag1));
                accelerations[j] = accelerations[j].add(dir.mult(-accelMag2));

                if (this.useQuadrupole) {
                    accelerations[i] = accelerations[i].add(this.calculateQuadrupoleAccel(b2, r.mult(-1)));
                    accelerations[j] = accelerations[j].add(this.calculateQuadrupoleAccel(b1, r));
                }
            }
        }

        return accelerations;
    }

    calculateGravityGradientTorque(body, rHat, dist, otherMass) {
        if (!body.inertiaDiag || !body.axisX || !body.axisY || !body.axisZ) {
            return new Vector3();
        }

        const ux = body.axisX.dot(rHat);
        const uy = body.axisY.dot(rHat);
        const uz = body.axisZ.dot(rHat);
        const u = new Vector3(ux, uy, uz);
        const Iu = new Vector3(
            body.inertiaDiag.x * ux,
            body.inertiaDiag.y * uy,
            body.inertiaDiag.z * uz
        );
        const torqueBody = u.cross(Iu).mult(3 * this.gConst * otherMass / (dist * dist * dist));
        const scaled = torqueBody.mult(body.k2 * body.tidalStrength);

        return body.axisX.mult(scaled.x)
            .add(body.axisY.mult(scaled.y))
            .add(body.axisZ.mult(scaled.z));
    }

    calculateTidalDampingTorque(body, r, vRel, otherMass) {
        const distSq = r.magSq();
        if (distSq < 1e-9) return new Vector3();
        const dist = Math.sqrt(distSq);
        const safeDist = Math.max(dist, body.radius);
        const invDist6 = 1 / Math.pow(safeDist, 6);
        const h = r.cross(vRel);
        const omegaOrb = distSq > 0 ? h.div(distSq) : new Vector3();
        const omegaProj = body.spinAxis.dot(omegaOrb);
        const torqueCoeff = -3 * this.gConst * otherMass * otherMass * body.k2 *
            Math.pow(body.radius, 5) * body.tidalLag;
        const torque = torqueCoeff * invDist6 * (body.spinRate - omegaProj) * body.tidalStrength;
        return body.spinAxis.mult(torque);
    }

    /**
     * Leapfrog (Verlet) integration - kick-drift-kick form
     * Symplectic integrator that conserves energy and is very stable
     * for orbital mechanics, even at high time scales
     */
    integrateLeapfrog(dt) {
        const n = this.bodies.length;
        if (n === 0) return;
        let accelerations = [];

        this.updateBodyShapes();
        accelerations = this.computeAccelerations();

        // Kick: Update velocities by half step
        for (let i = 0; i < n; i++) {
            this.bodies[i].velocity = this.bodies[i].velocity.add(accelerations[i].mult(dt * 0.5));
        }

        // Drift: Update positions by full step
        for (let i = 0; i < n; i++) {
            this.bodies[i].pos = this.bodies[i].pos.add(this.bodies[i].velocity.mult(dt));
        }

        this.updateBodyShapes();
        accelerations = this.computeAccelerations();

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
        const maxRadius = Math.max(...this.bodies.map(b => b.maxExtent || b.radius));
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
                            const diff = b2.pos.sub(b1.pos);
                            const distSq = diff.magSq();
                            const minDist = this.getSupportRadius(b1, diff) +
                                this.getSupportRadius(b2, diff.mult(-1));

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
                                const omega1 = b1.spinAxis.mult(b1.spinRate);
                                const omega2 = b2.spinAxis.mult(b2.spinRate);
                                const L1 = omega1.mult(b1.momentOfInertia);
                                const L2 = omega2.mult(b2.momentOfInertia);
                                const r1 = b1.pos.sub(newPos);
                                const r2 = b2.pos.sub(newPos);
                                const Lorb = r1.cross(b1.velocity.mult(b1.mass))
                                    .add(r2.cross(b2.velocity.mult(b2.mass)));
                                const totalL = L1.add(L2).add(Lorb);
                                const newI = 0.4 * totalMass * newRadius * newRadius;
                                let mergedSpinAxis = new Vector3(0, 1, 0);
                                let mergedSpinRate = 0;
                                let mergedSpinAngle = 0;
                                if (newI > 0 && totalL.magSq() > 1e-12) {
                                    mergedSpinRate = totalL.mag() / newI;
                                    mergedSpinAxis = totalL.normalize();
                                }

                                const merged = new Body(
                                    newPos,
                                    newVel,
                                    totalMass,
                                    newRadius,
                                    blendedColor,
                                    mergedSpinAxis,
                                    mergedSpinRate,
                                    mergedSpinAngle
                                );
                                merged.k2 = (b1.k2 * b1.mass + b2.k2 * b2.mass) / totalMass;
                                merged.tidalLag = (b1.tidalLag * b1.mass + b2.tidalLag * b2.mass) / totalMass;
                                merged.tidalStrength = (b1.tidalStrength * b1.mass + b2.tidalStrength * b2.mass) / totalMass;
                                merged.obliquityAlignRate = (b1.obliquityAlignRate * b1.mass + b2.obliquityAlignRate * b2.mass) / totalMass;
                                merged.updateInertia();

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
     * @param {{mode: string, targetId: string|null}|null} trailReference - Trail reference frame
     */
    update(followedPlanetId = null, trailReference = null) {
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
        const trailMode = trailReference ? trailReference.mode : 'world';
        const trailTargetId = trailReference ? trailReference.targetId : null;
        const zeroOffset = new Vector3(0, 0, 0);

        // Run integration multiple times with smaller steps
        for (let step = 0; step < substeps; step++) {
            this.integrateLeapfrog(substepDt);

            // Handle collisions after each substep, passing followed planet ID
            this.handleCollisions(followedPlanetId);

            // Update shapes after merges before rotational dynamics
            this.updateBodyShapes();

            // Update rotational dynamics (spin + obliquity)
            this.updateRotationalDynamics(substepDt);

            // Update trails periodically (not every substep at high time scales)
            if (step % trailUpdateInterval === 0) {
                let referenceOffset = zeroOffset;
                if (trailMode === 'com') {
                    referenceOffset = this.getCenterOfMass();
                } else if (trailMode === 'planet' && trailTargetId) {
                    const target = this.bodies.find((body) => body.id === trailTargetId);
                    if (target) {
                        referenceOffset = target.pos;
                    }
                }

                for (const body of this.bodies) {
                    const skipTargetTrail = trailMode === 'planet'
                        && trailTargetId
                        && body.id === trailTargetId
                        && this.showTrails;
                    if (skipTargetTrail) {
                        continue;
                    }
                    body.updateTrail(this.showTrails, maxTrailLength, referenceOffset);
                }
            }
        }
    }

    updateRotationalDynamics(dt) {
        const n = this.bodies.length;
        if (n === 0) return;

        // Accumulate tidal torques and apply spin/axis evolution.
        const torques = new Array(n);
        for (let i = 0; i < n; i++) {
            torques[i] = new Vector3();
        }

        const eps = 1e-9;

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const b1 = this.bodies[i];
                const b2 = this.bodies[j];
                const r = b2.pos.sub(b1.pos);
                const distSq = r.magSq();
                if (distSq < eps) continue;

                const dist = Math.sqrt(distSq);
                const rHat = r.div(dist);
                const rHatNeg = rHat.mult(-1);

                torques[i] = torques[i].add(this.calculateGravityGradientTorque(b1, rHat, dist, b2.mass));
                torques[j] = torques[j].add(this.calculateGravityGradientTorque(b2, rHatNeg, dist, b1.mass));

                const vRel = b2.velocity.sub(b1.velocity);
                torques[i] = torques[i].add(this.calculateTidalDampingTorque(b1, r, vRel, b2.mass));
                torques[j] = torques[j].add(this.calculateTidalDampingTorque(b2, r.mult(-1), vRel.mult(-1), b1.mass));
            }
        }

        for (let i = 0; i < n; i++) {
            const body = this.bodies[i];
            if (!body.spinAxis || body.momentOfInertia <= 0) continue;

            const Ispin = body.inertiaDiag ? body.inertiaDiag.y : body.momentOfInertia;
            if (Ispin <= 0) continue;

            let L = body.spinAxis.mult(body.spinRate * Ispin);
            L = L.add(torques[i].mult(dt));

            const Lmag = L.mag();
            if (Lmag > eps) {
                body.spinAxis = L.div(Lmag);
                body.spinRate = Lmag / Ispin;
            } else {
                body.spinRate = 0;
            }

            body.spinRate = Math.min(this.maxSpinRate, Math.max(0, body.spinRate));

            body.spinAngle += body.spinRate * dt;
            if (body.spinAngle > Math.PI * 2) {
                body.spinAngle -= Math.PI * 2;
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
