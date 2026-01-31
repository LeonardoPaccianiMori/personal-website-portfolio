/**
 * Renderer - Handles Three.js scene, camera, and rendering
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ChunkManager } from './chunkManager.js';

export class Renderer {
    constructor(container) {
        this.container = container;
        this.bodyMeshes = new Map(); // Map body.id -> mesh bundle
        this.trailLines = new Map(); // Map body.id -> line
        this.trailFrameOffset = new THREE.Vector3(0, 0, 0);
        this.gridMeridians = 12;
        this.gridParallels = 6;

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

    getContrastingGridColor(color) {
        const hex = (color || '#ffffff').replace('#', '');
        const fullHex = hex.length === 3
            ? hex.split('').map((c) => c + c).join('')
            : hex.padStart(6, '0');
        const r = parseInt(fullHex.substring(0, 2), 16);
        const g = parseInt(fullHex.substring(2, 4), 16);
        const b = parseInt(fullHex.substring(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.6 ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    }

    createGridTexture(color) {
        const width = 512;
        const height = 256;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = this.getContrastingGridColor(color);
        ctx.lineWidth = 2;

        // Meridians
        for (let i = 0; i <= this.gridMeridians; i++) {
            const x = (i / this.gridMeridians) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Parallels (exclude poles)
        for (let j = 1; j <= this.gridParallels; j++) {
            const y = (j / (this.gridParallels + 1)) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.needsUpdate = true;
        return texture;
    }

    createPlanetGroup(radius, color, options = {}) {
        const {
            opacity = 1,
            emissiveIntensity = 0.2,
            gridOpacity = 0.7
        } = options;

        // Group hierarchy: axis (tilt) -> deform (oblateness) -> spin (rotation) -> meshes.
        const axisGroup = new THREE.Group();
        const deformGroup = new THREE.Group();
        const spinGroup = new THREE.Group();

        const baseGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity,
            shininess: 30,
            transparent: opacity < 1,
            opacity
        });
        const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);

        const gridGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const gridTexture = this.createGridTexture(color);
        const gridMaterial = new THREE.MeshBasicMaterial({
            map: gridTexture,
            transparent: true,
            opacity: gridOpacity,
            depthWrite: false
        });
        const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
        gridMesh.scale.set(1.01, 1.01, 1.01);

        spinGroup.add(baseMesh);
        spinGroup.add(gridMesh);
        deformGroup.add(spinGroup);
        axisGroup.add(deformGroup);

        return {
            group: axisGroup,
            axisGroup,
            deformGroup,
            spinGroup,
            baseMesh,
            gridMesh,
            baseRadius: radius,
            color
        };
    }

    disposeObject(object) {
        object.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
                if (child.material.map) {
                    child.material.map.dispose();
                }
                child.material.dispose();
            }
        });
    }

    /**
     * Create or update mesh for a body
     */
    updateBody(body) {
        let entry = this.bodyMeshes.get(body.id);

        if (!entry) {
            entry = this.createPlanetGroup(body.radius, body.color);
            this.scene.add(entry.group);
            this.bodyMeshes.set(body.id, entry);
        }

        // Update position
        entry.group.position.set(body.pos.x, body.pos.y, body.pos.z);

        // Update scale if radius changed (for merged bodies)
        const scale = body.radius / entry.baseRadius;
        entry.axisGroup.scale.set(scale, scale, scale);

        if (entry.deformGroup && body.axes) {
            const a = body.axes.a;
            const b = body.axes.b;
            const c = body.axes.c;
            entry.deformGroup.scale.set(
                a / body.radius,
                c / body.radius,
                b / body.radius
            );
        } else if (entry.deformGroup) {
            entry.deformGroup.scale.set(1, 1, 1);
        }

        // Update colors if changed (merged bodies)
        if (body.color !== entry.color) {
            entry.baseMesh.material.color.set(body.color);
            entry.baseMesh.material.emissive.set(body.color);
            if (entry.gridMesh.material.map) {
                entry.gridMesh.material.map.dispose();
            }
            entry.gridMesh.material.map = this.createGridTexture(body.color);
            entry.gridMesh.material.needsUpdate = true;
            entry.color = body.color;
        }
    }

    updateBodyRotation(body) {
        const entry = this.bodyMeshes.get(body.id);
        if (!entry || !body.spinAxis) return;

        if (body.axisX && body.axisY && body.axisZ) {
            const xAxis = new THREE.Vector3(body.axisX.x, body.axisX.y, body.axisX.z);
            const yAxis = new THREE.Vector3(body.axisY.x, body.axisY.y, body.axisY.z);
            const zAxis = new THREE.Vector3(body.axisZ.x, body.axisZ.y, body.axisZ.z);
            const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
            entry.axisGroup.quaternion.setFromRotationMatrix(basis);
        } else {
            const axis = new THREE.Vector3(body.spinAxis.x, body.spinAxis.y, body.spinAxis.z);
            if (axis.lengthSq() === 0) return;
            const up = new THREE.Vector3(0, 1, 0);
            entry.axisGroup.quaternion.setFromUnitVectors(up, axis.normalize());
        }
        entry.spinGroup.rotation.set(0, body.spinAngle || 0, 0);
    }

    /**
     * Update trail for a body with distance-based culling
     */
    updateTrail(body, maxTrailDistance = 1000) {
        let line = this.trailLines.get(body.id);
        const frameOffset = this.trailFrameOffset;

        // Trails are stored in reference-frame coordinates; translate line to the frame origin.
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
            line.position.copy(frameOffset);
            this.scene.add(line);
            this.trailLines.set(body.id, line);
        } else {
            // Update existing line
            line.visible = true; // Make sure it's visible
            if (line.material && line.material.color) {
                line.material.color.set(body.color);
            }
            line.geometry.setFromPoints(points);
            line.geometry.attributes.position.needsUpdate = true;
            line.geometry.computeBoundingSphere(); // Ensure bounding sphere is recalculated
            line.position.copy(frameOffset);
        }
    }

    /**
     * Remove mesh for deleted body
     */
    removeBody(bodyId) {
        const entry = this.bodyMeshes.get(bodyId);
        if (entry) {
            this.scene.remove(entry.group);
            this.disposeObject(entry.group);
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
        for (const [id, entry] of this.bodyMeshes) {
            this.scene.remove(entry.group);
            this.disposeObject(entry.group);
        }
        this.bodyMeshes.clear();

        this.clearTrails();
    }

    clearTrails() {
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
            this.updateBodyRotation(body);
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

        // Create a plane perpendicular to camera, anchored in front of the camera
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        const planePoint = this.camera.position
            .clone()
            .add(cameraDirection.clone().multiplyScalar(distance));
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            cameraDirection,
            planePoint
        );

        const intersection = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, intersection);

        return intersection;
    }

    getWorldPositionOnPlane(event, planePoint, planeNormal = null) {
        this.getMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const normal = planeNormal ? planeNormal.clone().normalize() : new THREE.Vector3();
        if (!planeNormal) {
            this.camera.getWorldDirection(normal);
        }

        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, planePoint);
        const intersection = new THREE.Vector3();
        const hit = this.raycaster.ray.intersectPlane(plane, intersection);

        return hit ? intersection : planePoint.clone();
    }

    /**
     * Find body at mouse position
     */
    getBodyAtMouse(event, bodies) {
        this.getMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const meshes = bodies
            .map(b => {
                const entry = this.bodyMeshes.get(b.id);
                return entry ? entry.baseMesh : null;
            })
            .filter(m => m);
        const intersects = this.raycaster.intersectObjects(meshes, false);

        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            // Find body by mesh
            for (const body of bodies) {
                const entry = this.bodyMeshes.get(body.id);
                if (entry && entry.baseMesh === mesh) {
                    return body;
                }
            }
        }

        return null;
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
        const entry = this.createPlanetGroup(radius, color, {
            opacity: 0.6,
            emissiveIntensity: 0.3,
            gridOpacity: 0.8
        });
        entry.group.position.copy(position);
        this.scene.add(entry.group);
        return entry.group;
    }

    /**
     * Remove preview sphere
     */
    removePreviewSphere(mesh) {
        if (mesh) {
            this.scene.remove(mesh);
            this.disposeObject(mesh);
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

    createAxisArrow(origin, axis, length, color, headLength = null, headWidth = null) {
        const dir = axis.clone().normalize();
        if (dir.length() < 0.1 || length < 0.1) return null;

        const finalHeadLength = typeof headLength === 'number' ? headLength : length * 0.2;
        const finalHeadWidth = typeof headWidth === 'number' ? headWidth : length * 0.1;
        const arrowHelper = new THREE.ArrowHelper(
            dir,
            origin,
            length,
            color,
            finalHeadLength,
            finalHeadWidth
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
