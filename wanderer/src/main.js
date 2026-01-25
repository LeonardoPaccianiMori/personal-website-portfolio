/**
 * Wanderer - Main Game Loop
 * A 3D gravity simulator inspired by the classic Planets game
 * Version: 2025-11-22-v3
 */

import * as THREE from 'three';
import { PhysicsEngine, Body, Vector3 } from './physics.js';
import { Renderer } from './renderer.js';

class Wanderer {
    constructor() {
        this.physics = new PhysicsEngine();
        this.renderer = new Renderer(document.getElementById('canvas-container'));

        // UI elements
        this.ui = {
            bodyCount: document.getElementById('body-count'),
            energy: document.getElementById('energy'),
            fps: document.getElementById('fps'),
            timeScale: document.getElementById('time-scale'),
            mode: document.getElementById('mode'),
            modeIndicator: document.getElementById('mode-indicator'),
            planetMass: document.getElementById('planet-mass'),
            planetMassStat: document.getElementById('planet-mass-stat'),
            controls: document.getElementById('controls-section')
        };

        // Controls visibility state
        this.controlsVisible = true;

        // Input state
        this.inputMode = 'normal'; // 'normal', 'placing_position', 'placing_velocity'
        this.densityFactor = 1.0;  // Constant for mass calculation
        this.wasAlreadyPaused = false;  // Track if physics was paused before planet placement
        this.followCOM = false;  // Track if camera should follow center of mass
        this.followedPlanet = null;  // Track which planet to follow (null = none)
        this.previousPlanetPos = null;  // Previous position of followed planet
        this.placementState = {
            position: null,
            previewMesh: null,
            velocityArrow: null,
            radius: 2.0,
            mass: this.calculateMass(2.0),
            color: this.getRandomColor()
        };

        // Camera movement state
        this.cameraMovement = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false,
            speed: 0.5,
            fastSpeed: 2.0,
            shiftPressed: false,
            altPressed: false,
            rotationSpeed: 0.02
        };

        // Previous CoM position for tracking movement
        this.previousCOM = null;

        // FPS tracking
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.fps = 60;

        this.setupEventListeners();
        this.createInitialBodies();
        this.start();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Mouse controls
        this.renderer.renderer.domElement.addEventListener('click', (e) => this.onClick(e));
        this.renderer.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.renderer.domElement.addEventListener('wheel', (e) => this.onWheel(e));

        // Disable context menu
        this.renderer.renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    onKeyDown(event) {
        const key = event.key.toLowerCase();

        // Prevent default browser shortcuts when using Alt+WASD and Alt+B
        if (event.altKey && (key === 'w' || key === 's' || key === 'a' || key === 'd' || key === 'b')) {
            event.preventDefault();
        }

        // Handle WASD movement (not during planet placement)
        if (this.inputMode !== 'placing_position' && this.inputMode !== 'placing_velocity') {

            switch (key) {
                case 'w':
                    this.cameraMovement.forward = true;
                    break;
                case 's':
                    this.cameraMovement.backward = true;
                    break;
                case 'a':
                    this.cameraMovement.left = true;
                    break;
                case 'd':
                    this.cameraMovement.right = true;
                    break;
                case 'shift':
                    this.cameraMovement.shiftPressed = true;
                    break;
                case 'alt':
                    this.cameraMovement.altPressed = true;
                    break;
            }
        }

        // Handle action keys
        switch (key) {
            case 'e':
                this.startPlacingPlanet();
                break;

            case ' ':
                event.preventDefault();
                const paused = this.physics.togglePause();
                if (paused) {
                    this.updateModeDisplay('Paused');
                } else {
                    // Restore previous mode
                    if (this.followedPlanet) {
                        this.updateModeDisplay('Follow Planet');
                    } else if (this.followCOM) {
                        this.updateModeDisplay('Center of Mass');
                    } else {
                        this.updateModeDisplay('Normal');
                    }
                }
                break;

            case 't':
                const trails = this.physics.toggleTrails();
                this.showTemporaryMessage(trails ? 'Trails ON' : 'Trails OFF');
                break;

            case 'f':
                this.toggleFollowCOM();
                break;

            case 'r':
                this.resetGame();
                break;

            case 'q':
                this.addRandomPlanet();
                break;

            case 'h':
                this.toggleControls();
                break;

            case 'c':
                if (event.altKey) {
                    // Alt+C: Reset time scale to 1x
                    const resetScale = this.physics.resetTimeScale();
                    this.showTemporaryMessage(`Time: ${resetScale}x (Reset)`);
                } else {
                    // C: Decrease time scale
                    const slowedScale = this.physics.decreaseTimeScale();
                    this.showTemporaryMessage(`Time: ${slowedScale}x`);
                }
                break;

            case 'v':
                if (event.altKey) {
                    // Alt+V: Reset time scale to 1x
                    const resetScale = this.physics.resetTimeScale();
                    this.showTemporaryMessage(`Time: ${resetScale}x (Reset)`);
                } else {
                    // V: Increase time scale
                    const speedScale = this.physics.increaseTimeScale();
                    this.showTemporaryMessage(`Time: ${speedScale}x`);
                }
                break;

            case 'escape':
                this.cancelPlacement();
                break;

            case '+':
            case '=':
                if (this.inputMode === 'placing_position') {
                    this.placementState.radius = Math.min(this.placementState.radius + 0.5, 10);
                    this.placementState.mass = this.placementState.radius * 2.5;
                    this.updatePreviewSphere();
                }
                break;

            case '-':
            case '_':
                if (this.inputMode === 'placing_position') {
                    this.placementState.radius = Math.max(this.placementState.radius - 0.5, 0.5);
                    this.placementState.mass = this.placementState.radius * 2.5;
                    this.updatePreviewSphere();
                }
                break;
        }
    }

    onKeyUp(event) {
        const key = event.key.toLowerCase();

        // Handle WASD movement release
        switch (key) {
            case 'w':
                this.cameraMovement.forward = false;
                break;
            case 's':
                this.cameraMovement.backward = false;
                break;
            case 'a':
                this.cameraMovement.left = false;
                break;
            case 'd':
                this.cameraMovement.right = false;
                break;
            case 'shift':
                this.cameraMovement.shiftPressed = false;
                break;
            case 'alt':
                this.cameraMovement.altPressed = false;
                break;
        }
    }

    onClick(event) {
        // Prevent triggering during orbit controls
        if (event.button !== 0) return;

        // Prevent default behavior for Alt+Click
        if (event.altKey) {
            event.preventDefault();
        }

        switch (this.inputMode) {
            case 'normal':
                this.handleNormalClick(event);
                break;

            case 'placing_position':
                this.handlePositionClick(event);
                break;

            case 'placing_velocity':
                this.handleVelocityClick(event);
                break;
        }
    }

    onMouseMove(event) {
        if (this.inputMode === 'placing_position' && this.placementState.previewMesh) {
            const worldPos = this.renderer.getWorldPosition(event);
            this.placementState.previewMesh.position.copy(worldPos);
        } else if (this.inputMode === 'placing_velocity') {
            const worldPos = this.renderer.getWorldPosition(event);
            // Update velocity arrow
            this.renderer.removeVelocityArrow(this.placementState.velocityArrow);
            this.placementState.velocityArrow = this.renderer.createVelocityArrow(
                this.placementState.position,
                worldPos,
                this.placementState.color
            );
            // Keep preview sphere at fixed position (don't move it)
        }
    }

    onWheel(event) {
        if (this.inputMode === 'placing_position') {
            event.preventDefault();

            // Adjust planet size based on scroll direction
            const delta = event.deltaY > 0 ? -0.3 : 0.3;
            this.placementState.radius = Math.max(0.5, Math.min(10, this.placementState.radius + delta));
            this.placementState.mass = this.calculateMass(this.placementState.radius);

            this.updatePreviewSphere();
            this.updateMassDisplay();
        }
    }

    calculateMass(radius) {
        // Mass scales with volume (radius^3) for realistic physics
        // Using a density factor to keep masses reasonable
        return this.densityFactor * Math.pow(radius, 3);
    }

    handleNormalClick(event) {
        const body = this.renderer.getBodyAtMouse(event, this.physics.bodies);
        if (body) {
            if (event.altKey) {
                // Alt+Click: Follow this planet
                this.followPlanet(body);
            } else {
                // Normal click: Delete planet
                // Don't delete if we're following it
                if (this.followedPlanet === body) {
                    this.followedPlanet = null;
                    this.previousPlanetPos = null;
                    this.updateModeDisplay('Normal');
                }
                this.physics.removeBody(body);
                this.renderer.removeBody(body.id);
                this.showTemporaryMessage('Planet Deleted');
            }
        }
    }

    handlePositionClick(event) {
        const worldPos = this.renderer.getWorldPosition(event);
        this.placementState.position = worldPos;

        // Keep preview sphere visible and fix its position
        if (this.placementState.previewMesh) {
            this.placementState.previewMesh.position.copy(worldPos);
        }

        // Switch to velocity mode
        this.inputMode = 'placing_velocity';
        this.updateModeDisplay('Set Velocity (drag from planet)');

        // Create initial velocity arrow
        this.placementState.velocityArrow = this.renderer.createVelocityArrow(
            worldPos,
            worldPos,
            this.placementState.color
        );
    }

    handleVelocityClick(event) {
        const worldPos = this.renderer.getWorldPosition(event);
        const velocity = new Vector3(
            worldPos.x - this.placementState.position.x,
            worldPos.y - this.placementState.position.y,
            worldPos.z - this.placementState.position.z
        ).mult(0.5); // Scale velocity for better control

        // Create the body
        const body = new Body(
            new Vector3(
                this.placementState.position.x,
                this.placementState.position.y,
                this.placementState.position.z
            ),
            velocity,
            this.placementState.mass,
            this.placementState.radius,
            this.placementState.color
        );

        this.physics.addBody(body);

        // Clean up
        this.renderer.removeVelocityArrow(this.placementState.velocityArrow);
        this.placementState.velocityArrow = null;
        this.renderer.removePreviewSphere(this.placementState.previewMesh);
        this.placementState.previewMesh = null;

        // Hide mass display
        this.ui.planetMassStat.style.display = 'none';

        // Resume physics if it wasn't paused before placement
        if (!this.wasAlreadyPaused && this.physics.paused) {
            this.physics.togglePause();
        }

        // Reset for next planet
        this.inputMode = 'normal';
        this.updateModeDisplay(this.followCOM ? 'Center of Mass' : 'Normal');
        this.placementState.color = this.getRandomColor();
        this.showTemporaryMessage('Planet Added!');

        // Re-enable orbit controls
        this.renderer.controls.enabled = true;
    }

    startPlacingPlanet() {
        if (this.inputMode !== 'normal') {
            this.cancelPlacement();
            return;
        }

        this.inputMode = 'placing_position';
        this.updateModeDisplay('Set Position (click to place)');
        this.showTemporaryMessage('Scroll to resize, click to place');

        // Pause physics and disable orbit controls during placement
        this.wasAlreadyPaused = this.physics.paused;
        if (!this.physics.paused) {
            this.physics.togglePause();
        }
        this.renderer.controls.enabled = false;

        // Show mass display
        this.ui.planetMassStat.style.display = 'block';
        this.updateMassDisplay();

        // Create preview sphere at mouse position
        const worldPos = this.renderer.getWorldPosition({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
        this.placementState.previewMesh = this.renderer.createPreviewSphere(
            worldPos,
            this.placementState.radius,
            this.placementState.color
        );
    }

    updatePreviewSphere() {
        if (this.placementState.previewMesh) {
            const pos = this.placementState.previewMesh.position;
            this.renderer.removePreviewSphere(this.placementState.previewMesh);
            this.placementState.previewMesh = this.renderer.createPreviewSphere(
                pos,
                this.placementState.radius,
                this.placementState.color
            );
        }
    }

    cancelPlacement() {
        this.renderer.removePreviewSphere(this.placementState.previewMesh);
        this.renderer.removeVelocityArrow(this.placementState.velocityArrow);
        this.placementState.previewMesh = null;
        this.placementState.velocityArrow = null;
        this.placementState.position = null;
        this.inputMode = 'normal';
        this.updateModeDisplay(this.followCOM ? 'Center of Mass' : 'Normal');

        // Hide mass display
        this.ui.planetMassStat.style.display = 'none';

        // Resume physics if it wasn't paused before placement
        if (!this.wasAlreadyPaused && this.physics.paused) {
            this.physics.togglePause();
        }

        // Re-enable orbit controls
        this.renderer.controls.enabled = true;
    }

    updateMassDisplay() {
        this.ui.planetMass.textContent = this.placementState.mass.toFixed(1);
    }

    toggleControls() {
        this.controlsVisible = !this.controlsVisible;
        this.ui.controls.style.display = this.controlsVisible ? 'block' : 'none';
    }

    toggleFollowCOM() {
        this.followCOM = !this.followCOM;
        if (this.followCOM) {
            // Turn off planet following
            this.followedPlanet = null;
            this.previousPlanetPos = null;
            // Will start tracking CoM on next frame
            this.showTemporaryMessage('Follow CoM ON');
            this.updateModeDisplay('Center of Mass');
        } else {
            this.showTemporaryMessage('Follow CoM OFF');
            this.updateModeDisplay('Normal');
            this.previousCOM = null;
        }
    }

    followPlanet(planet) {
        // Turn off CoM following
        this.followCOM = false;
        this.previousCOM = null;

        // Set the planet to follow
        this.followedPlanet = planet;
        this.previousPlanetPos = null; // Will be set on next frame
        this.showTemporaryMessage('Following Planet');
        this.updateModeDisplay('Follow Planet');
    }

    resetGame() {
        // Clear all bodies from physics and renderer
        this.physics.clear();
        this.renderer.clearBodies();

        // Reset camera
        this.renderer.resetCamera();

        // Turn off follow modes
        this.followCOM = false;
        this.previousCOM = null;
        this.followedPlanet = null;
        this.previousPlanetPos = null;

        // Unpause if paused
        if (this.physics.paused) {
            this.physics.togglePause();
        }

        // Reset trails
        this.physics.showTrails = true;

        // Reset time scale
        this.physics.resetTimeScale();

        // Recreate initial bodies
        this.createInitialBodies();

        // Update UI
        this.updateModeDisplay('Normal');
        this.showTemporaryMessage('Game Reset');
    }

    addRandomPlanet() {
        // Random position within the camera's field of view
        // Generate random screen coordinates (normalized device coordinates -1 to 1)
        const randomScreenX = (Math.random() - 0.5) * 2;
        const randomScreenY = (Math.random() - 0.5) * 2;

        // Random distance from camera (between 10 and 900 units - almost the entire far clipping plane)
        // Using cubic distribution for uniform spatial density in the viewing cone
        const near = 10;
        const far = 900;
        const randomDistance = Math.cbrt(near**3 + Math.random() * (far**3 - near**3));

        // Use raycaster to get world position
        const camera = this.renderer.camera;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(randomScreenX, randomScreenY);

        raycaster.setFromCamera(mouse, camera);

        // Get point along the ray at the random distance
        const worldPos = raycaster.ray.origin.clone().add(
            raycaster.ray.direction.clone().multiplyScalar(randomDistance)
        );

        const position = new Vector3(worldPos.x, worldPos.y, worldPos.z);

        // Random radius between 0.5 and 5
        const radius = 0.5 + Math.random() * 4.5;

        // Mass based on volume (using same formula as manual placement)
        const mass = this.calculateMass(radius);

        // Random velocity with magnitude (length) at most 2
        // Generate random direction
        const theta = Math.random() * Math.PI * 2; // Random angle around z-axis
        const phi = Math.acos(2 * Math.random() - 1); // Random angle from z-axis (uniform on sphere)
        const maxSpeed = 2;
        const speed = Math.random() * maxSpeed; // Random speed from 0 to 2

        // Convert spherical to cartesian
        const velocity = new Vector3(
            speed * Math.sin(phi) * Math.cos(theta),
            speed * Math.sin(phi) * Math.sin(theta),
            speed * Math.cos(phi)
        );

        // Random color
        const color = this.getRandomColor();

        // Create and add the body
        const body = new Body(position, velocity, mass, radius, color);
        this.physics.addBody(body);
    }

    createInitialBodies() {
        // Create a simple solar system-like setup
        const colors = ['#ffff00', '#ff6b35', '#4ecdc4', '#95e1d3', '#f38181'];

        // Central massive body (sun)
        const sun = new Body(
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            100,
            4,
            '#ffff00'
        );
        this.physics.addBody(sun);

        // Orbiting planets
        const planets = [
            { distance: 15, mass: 3, radius: 1.5, color: '#ff6b35', speed: 0.15 },
            { distance: 25, mass: 4, radius: 2, color: '#4ecdc4', speed: 0.10 },
            { distance: 35, mass: 2, radius: 1.2, color: '#95e1d3', speed: 0.08 },
        ];

        for (const p of planets) {
            // Calculate orbital velocity for circular orbit
            const orbitalSpeed = Math.sqrt(this.physics.gConst * sun.mass / p.distance);
            const body = new Body(
                new Vector3(p.distance, 0, 0),
                new Vector3(0, 0, orbitalSpeed),
                p.mass,
                p.radius,
                p.color
            );
            this.physics.addBody(body);
        }
    }

    getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
            '#dfe6e9', '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateUI() {
        this.ui.bodyCount.textContent = this.physics.bodies.length;
        this.ui.energy.textContent = this.physics.getTotalEnergy().toFixed(2);
        this.ui.fps.textContent = Math.round(this.fps);
        this.ui.timeScale.textContent = `${this.physics.timeScale}x`;
    }

    updateModeDisplay(mode) {
        this.ui.mode.textContent = mode;
    }

    showTemporaryMessage(message) {
        this.ui.modeIndicator.textContent = message;
        this.ui.modeIndicator.classList.add('active');
        setTimeout(() => {
            this.ui.modeIndicator.classList.remove('active');
        }, 1500);
    }

    updateFPS() {
        this.frameCount++;
        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;

        if (elapsed >= 1000) {
            this.fps = (this.frameCount * 1000) / elapsed;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }

    update() {
        this.updateFPS();

        // Pass followed planet ID to physics for collision tracking
        const followedId = this.followedPlanet ? this.followedPlanet.id : null;
        this.physics.update(followedId);

        // Update camera to follow a specific planet if enabled
        if (this.followedPlanet) {
            // Check if the planet still exists (by reference)
            if (this.physics.bodies.includes(this.followedPlanet)) {
                const planetPos = this.followedPlanet.pos;

                // Track planet movement and move camera/target along with it
                if (this.previousPlanetPos) {
                    const planetDelta = new THREE.Vector3(
                        planetPos.x - this.previousPlanetPos.x,
                        planetPos.y - this.previousPlanetPos.y,
                        planetPos.z - this.previousPlanetPos.z
                    );

                    // Move camera and target by the same amount planet moved
                    this.renderer.camera.position.add(planetDelta);
                    this.renderer.controls.target.add(planetDelta);
                } else {
                    // First frame of Follow Planet - set target to planet
                    this.renderer.controls.target.set(planetPos.x, planetPos.y, planetPos.z);
                }

                this.previousPlanetPos = new THREE.Vector3(planetPos.x, planetPos.y, planetPos.z);
            } else {
                // Planet reference changed - check if it merged (ID preserved)
                const followedId = this.followedPlanet.id;
                console.log('Looking for planet with ID:', followedId);
                console.log('Current body IDs:', this.physics.bodies.map(b => b.id));
                const mergedPlanet = this.physics.bodies.find(b => b.id === followedId);
                if (mergedPlanet) {
                    // Planet merged! Update reference to the merged body
                    console.log('Found merged planet!');
                    this.followedPlanet = mergedPlanet;
                    this.previousPlanetPos = null; // Reset to recalculate on next frame
                    this.showTemporaryMessage('Following merged planet');
                } else {
                    // Planet was deleted
                    console.log('Planet lost - no matching ID found');
                    this.followedPlanet = null;
                    this.previousPlanetPos = null;
                    this.updateModeDisplay('Normal');
                    this.showTemporaryMessage('Followed planet lost');
                }
            }
        }

        // Update camera to follow center of mass if enabled
        if (this.followCOM && this.physics.bodies.length > 0) {
            const com = this.physics.getCenterOfMass();

            // Track CoM movement and move camera/target along with it
            if (this.previousCOM) {
                const comDelta = new THREE.Vector3(
                    com.x - this.previousCOM.x,
                    com.y - this.previousCOM.y,
                    com.z - this.previousCOM.z
                );

                // Move camera and target by the same amount CoM moved
                this.renderer.camera.position.add(comDelta);
                this.renderer.controls.target.add(comDelta);
            } else {
                // First frame of Follow CoM - set target to CoM
                this.renderer.controls.target.set(com.x, com.y, com.z);
            }

            this.previousCOM = new THREE.Vector3(com.x, com.y, com.z);
        } else {
            this.previousCOM = null;
        }

        // Update camera movement (WASD)
        if (this.inputMode !== 'placing_position' && this.inputMode !== 'placing_velocity') {
            this.updateCameraMovement();
        }

        this.renderer.render(this.physics.bodies);
        this.updateUI();
        requestAnimationFrame(() => this.update());
    }

    updateCameraMovement() {
        const camera = this.renderer.camera;
        const controls = this.renderer.controls;

        if (this.cameraMovement.altPressed) {
            // Rotation mode: Alt+WASD rotates camera around target
            const rotSpeed = this.cameraMovement.rotationSpeed;

            // Get vector from target to camera
            const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
            const distance = offset.length();

            // Convert to spherical coordinates
            const theta = Math.atan2(offset.x, offset.z);
            const phi = Math.acos(offset.y / distance);

            // Apply rotations
            let newTheta = theta;
            let newPhi = phi;

            if (this.cameraMovement.left) {
                newTheta += rotSpeed; // Rotate left
            }
            if (this.cameraMovement.right) {
                newTheta -= rotSpeed; // Rotate right
            }
            if (this.cameraMovement.forward) {
                newPhi = Math.max(0.1, newPhi - rotSpeed); // Rotate up
            }
            if (this.cameraMovement.backward) {
                newPhi = Math.min(Math.PI - 0.1, newPhi + rotSpeed); // Rotate down
            }

            // Convert back to Cartesian and update camera position
            const newOffset = new THREE.Vector3(
                distance * Math.sin(newPhi) * Math.sin(newTheta),
                distance * Math.cos(newPhi),
                distance * Math.sin(newPhi) * Math.cos(newTheta)
            );

            camera.position.copy(controls.target).add(newOffset);
            camera.lookAt(controls.target);
        } else {
            // Translation mode: WASD moves camera
            const speed = this.cameraMovement.shiftPressed ? this.cameraMovement.fastSpeed : this.cameraMovement.speed;

            // Get camera's forward and right vectors
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);

            const right = new THREE.Vector3();
            right.crossVectors(forward, camera.up).normalize();

            // Calculate movement
            const movement = new THREE.Vector3();

            if (this.cameraMovement.forward) {
                movement.add(forward.clone().multiplyScalar(speed));
            }
            if (this.cameraMovement.backward) {
                movement.add(forward.clone().multiplyScalar(-speed));
            }
            if (this.cameraMovement.left) {
                movement.add(right.clone().multiplyScalar(-speed));
            }
            if (this.cameraMovement.right) {
                movement.add(right.clone().multiplyScalar(speed));
            }

            // Apply movement - same for both modes
            camera.position.add(movement);
            controls.target.add(movement);
        }
    }

    start() {
        console.log('🌌 Wanderer - 3D Gravity Simulator');
        console.log('Controls:');
        console.log('  E - Add planet');
        console.log('  Q - Add random planet');
        console.log('  Click - Delete planet');
        console.log('  WASD - Move camera');
        console.log('  Ctrl+WASD - Rotate camera');
        console.log('  Shift - Fast move');
        console.log('  Mouse - Look around');
        console.log('  Space - Pause/Resume');
        console.log('  T - Toggle trails');
        console.log('  F - Follow center of mass');
        console.log('  R - Reset game');
        console.log('  Scroll - Zoom / Adjust planet size (during placement)');
        this.update();
    }
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Wanderer());
} else {
    new Wanderer();
}
