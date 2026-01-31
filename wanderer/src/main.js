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
        this.menuOpen = false;
        this.menuWasPaused = false;
        this.presetMenu = document.getElementById('preset-menu');
        this.presetGrid = document.getElementById('preset-grid');
        this.presets = this.buildPresets();
        this.initPresetMenu();
        this.presetCameraCenter = null;
        this.presetCameraFitMode = null;
        this.presetCameraKeepDistance = false;

        // Input state
        this.inputMode = 'normal'; // 'normal', 'placing_position', 'placing_velocity', 'placing_spin'
        this.densityFactor = 1.0;  // Constant for mass calculation
        this.wasAlreadyPaused = false;  // Track if physics was paused before planet placement
        this.followCOM = false;  // Track if camera should follow center of mass
        this.followedPlanet = null;  // Track which planet to follow (null = none)
        this.previousPlanetPos = null;  // Previous position of followed planet
        const defaultPlacementRadius = 2.0;
        // Planet placement workflow state (position -> velocity -> spin).
        this.placementState = {
            position: null,
            previewMesh: null,
            velocityArrow: null,
            spinArrow: null,
            velocity: null,
            spinAxis: new Vector3(0, 1, 0),
            spinAxisBase: null,
            spinTilt: 0,
            spinRate: 1.0,
            spinRateMin: 0.0,
            spinRateMax: 2.0,
            radius: defaultPlacementRadius,
            radiusMin: 0.5,
            radiusMax: 10,
            mass: this.calculateMass(defaultPlacementRadius),
            color: this.getRandomColor(),
            referenceMode: 'world',
            referenceTargetId: null
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
        this.messageDurationMs = 3500;
        this.placementMessageDurationMs = 10000;
        this.placementMessageTimeout = null;
        this.placementMessageActive = false;
        this.placementMessageText = '';
        // Tracks which frame trails should be recorded relative to.
        this.trailReference = {
            mode: 'world',
            targetId: null
        };

        this.setupEventListeners();
        this.createInitialBodies();
        this.fitCameraToBodiesAround(new THREE.Vector3(0, 0, 0));
        this.scaleCameraDistance(0.9);
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

    // Helper for gating input while placing a planet.
    isPlacing() {
        return this.inputMode === 'placing_position'
            || this.inputMode === 'placing_velocity'
            || this.inputMode === 'placing_spin';
    }

    onKeyDown(event) {
        const key = event.key.toLowerCase();

        if (key === 'm') {
            this.togglePresetMenu();
            return;
        }

        if (key === 'escape' && this.menuOpen) {
            this.togglePresetMenu(false);
            return;
        }

        if (this.menuOpen) {
            return;
        }

        // Prevent default browser shortcuts when using Alt+WASD
        if (event.altKey && (key === 'w' || key === 's' || key === 'a' || key === 'd')) {
            event.preventDefault();
        }

        // Handle WASD movement (not during planet placement)
        if (!this.isPlacing()) {

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

            case 'p':
                this.wipeAllBodies();
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
                    this.adjustPlacementRadius(0.5);
                }
                break;

            case '-':
            case '_':
                if (this.inputMode === 'placing_position') {
                    this.adjustPlacementRadius(-0.5);
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
        if (this.menuOpen) return;

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

            case 'placing_spin':
                this.handleSpinClick(event);
                break;
        }
    }

    onMouseMove(event) {
        if (this.menuOpen) return;
        if (this.isPlacing()) {
            this.refreshPlacementMessage();
        }

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
        } else if (this.inputMode === 'placing_spin' && this.placementState.position) {
            const planePoint = new THREE.Vector3(
                this.placementState.position.x,
                this.placementState.position.y,
                this.placementState.position.z
            );
            const worldPos = this.renderer.getWorldPositionOnPlane(event, planePoint);
            const axis = new Vector3(
                worldPos.x - this.placementState.position.x,
                worldPos.y - this.placementState.position.y,
                worldPos.z - this.placementState.position.z
            );
            if (axis.magSq() > 1e-6) {
                const baseAxis = axis.normalize();
                this.placementState.spinAxisBase = baseAxis;
                this.placementState.spinAxis = this.applySpinTilt(baseAxis);
                this.updateSpinArrow();
            }
        }
    }

    onWheel(event) {
        if (this.menuOpen) return;

        if (this.inputMode === 'placing_position') {
            event.preventDefault();
            this.refreshPlacementMessage();

            // Adjust planet size based on scroll direction
            const delta = event.deltaY > 0 ? -0.3 : 0.3;
            this.adjustPlacementRadius(delta);
        } else if (this.inputMode === 'placing_spin') {
            event.preventDefault();
            this.refreshPlacementMessage();
            if (event.ctrlKey) {
                this.tiltSpinAxis(event.deltaY);
                return;
            }
            const delta = event.deltaY > 0 ? -0.1 : 0.1;
            this.placementState.spinRate = Math.max(
                this.placementState.spinRateMin,
                Math.min(this.placementState.spinRateMax, this.placementState.spinRate + delta)
            );
            this.showTemporaryMessage(`Spin: ${this.placementState.spinRate.toFixed(2)} rad/s`);
            this.updateSpinArrow();
        }
    }

    calculateMass(radius) {
        // Mass scales with volume (radius^3) for realistic physics
        // Using a density factor to keep masses reasonable
        return this.densityFactor * Math.pow(radius, 3);
    }

    // Adjust placement radius and keep preview + mass display in sync.
    adjustPlacementRadius(delta) {
        const { radiusMin, radiusMax } = this.placementState;
        const nextRadius = Math.max(radiusMin, Math.min(radiusMax, this.placementState.radius + delta));
        if (nextRadius === this.placementState.radius) return;
        this.placementState.radius = nextRadius;
        this.placementState.mass = this.calculateMass(nextRadius);
        this.updatePreviewSphere();
        this.updateMassDisplay();
    }

    // Returns the frame velocity used when placing new bodies (world/CoM/planet).
    getPlacementReferenceVelocity() {
        const mode = this.placementState.referenceMode || 'world';
        if (mode === 'planet' && this.placementState.referenceTargetId) {
            const target = this.physics.bodies.find(
                (body) => body.id === this.placementState.referenceTargetId
            );
            return target ? target.velocity : new Vector3();
        }

        if (mode === 'com') {
            let totalMass = 0;
            let momentum = new Vector3();
            for (const body of this.physics.bodies) {
                momentum = momentum.add(body.velocity.mult(body.mass));
                totalMass += body.mass;
            }
            return totalMass > 0 ? momentum.div(totalMass) : new Vector3();
        }

        return new Vector3();
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
        this.placementState.spinAxis = this.getDefaultSpinAxis();
        this.placementState.spinAxisBase = this.placementState.spinAxis;
        this.placementState.spinTilt = 0;

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
        const relativeVelocity = new Vector3(
            worldPos.x - this.placementState.position.x,
            worldPos.y - this.placementState.position.y,
            worldPos.z - this.placementState.position.z
        ).mult(0.5); // Scale velocity for better control
        const referenceVelocity = this.getPlacementReferenceVelocity();
        const velocity = relativeVelocity.add(referenceVelocity);

        this.renderer.removeVelocityArrow(this.placementState.velocityArrow);
        this.placementState.velocityArrow = null;
        this.placementState.velocity = velocity;

        // Switch to spin mode
        this.inputMode = 'placing_spin';
        this.updateModeDisplay('Set Spin (drag axis, scroll speed)');
        this.showTemporaryMessage('Drag to set axis, scroll for speed, Ctrl+scroll to tilt, click to confirm');

        if (!this.placementState.spinAxis || this.placementState.spinAxis.magSq() <= 1e-6) {
            this.placementState.spinAxis = this.getDefaultSpinAxis();
        }
        if (!this.placementState.spinAxisBase || this.placementState.spinAxisBase.magSq() <= 1e-6) {
            this.placementState.spinAxisBase = this.placementState.spinAxis;
        }
        this.updateSpinArrow();
    }

    handleSpinClick(event) {
        if (!this.placementState.position || !this.placementState.velocity) return;

        const body = new Body(
            new Vector3(
                this.placementState.position.x,
                this.placementState.position.y,
                this.placementState.position.z
            ),
            this.placementState.velocity,
            this.placementState.mass,
            this.placementState.radius,
            this.placementState.color,
            this.placementState.spinAxis,
            this.placementState.spinRate
        );

        this.physics.addBody(body);

        // Clean up
        this.renderer.removeVelocityArrow(this.placementState.spinArrow);
        this.placementState.spinArrow = null;
        this.renderer.removePreviewSphere(this.placementState.previewMesh);
        this.placementState.previewMesh = null;
        this.placementState.velocity = null;

        // Hide mass display
        this.ui.planetMassStat.style.display = 'none';

        // Resume physics if it wasn't paused before placement
        if (!this.wasAlreadyPaused && this.physics.paused) {
            this.physics.togglePause();
        }

        // Reset for next planet
        this.inputMode = 'normal';
        this.clearPlacementMessage();
        this.updateModeDisplay(this.followCOM ? 'Center of Mass' : 'Normal');
        this.placementState.color = this.getRandomColor();
        this.showTemporaryMessage('Planet Added!');

        // Re-enable orbit controls
        this.setControlsEnabled(true);
    }

    startPlacingPlanet() {
        if (this.cancelPlacementIfActive()) return;

        this.inputMode = 'placing_position';
        this.updateModeDisplay('Set Position (click to place)');
        this.showTemporaryMessage('Scroll to resize, click to place');

        // Pause physics and disable orbit controls during placement
        this.wasAlreadyPaused = this.physics.paused;
        if (!this.physics.paused) {
            this.physics.togglePause();
        }
        this.setControlsEnabled(false);

        // Show mass display
        this.ui.planetMassStat.style.display = 'block';
        this.updateMassDisplay();

        // Reset placement spin state
        this.placementState.referenceMode = 'world';
        this.placementState.referenceTargetId = null;
        if (this.followedPlanet && this.physics.bodies.includes(this.followedPlanet)) {
            this.placementState.referenceMode = 'planet';
            this.placementState.referenceTargetId = this.followedPlanet.id;
        } else if (this.followCOM) {
            this.placementState.referenceMode = 'com';
        }
        this.placementState.velocity = null;
        this.renderer.removeVelocityArrow(this.placementState.spinArrow);
        this.placementState.spinArrow = null;
        this.placementState.spinAxis = null;
        this.placementState.spinAxisBase = null;
        this.placementState.spinTilt = 0;
        this.placementState.spinRate = 1.0;

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

    initPresetMenu() {
        if (!this.presetMenu || !this.presetGrid) return;

        this.presetGrid.innerHTML = '';
        for (const preset of this.presets) {
            const card = document.createElement('div');
            card.className = 'preset-card';
            card.dataset.presetId = preset.id;

            const title = document.createElement('div');
            title.className = 'preset-card-title';
            title.textContent = preset.name;

            const desc = document.createElement('div');
            desc.className = 'preset-card-desc';
            desc.textContent = preset.description;

            card.appendChild(title);
            card.appendChild(desc);
            card.addEventListener('click', () => {
                this.togglePresetMenu(false);
                requestAnimationFrame(() => {
                    this.loadPreset(preset.id);
                });
            });

            this.presetGrid.appendChild(card);
        }
    }

    setPresetMenuActive(isActive) {
        if (!this.presetMenu) return;
        this.presetMenu.classList.toggle('active', isActive);
    }

    // Convenience: cancel placement if any placement mode is active.
    cancelPlacementIfActive() {
        if (this.inputMode !== 'normal') {
            this.cancelPlacement();
            return true;
        }
        return false;
    }

    // Centralize orbit controls toggling.
    setControlsEnabled(enabled) {
        this.renderer.controls.enabled = enabled;
    }

    togglePresetMenu(forceState = null) {
        const shouldOpen = forceState === null ? !this.menuOpen : forceState;
        if (shouldOpen === this.menuOpen) return;

        this.menuOpen = shouldOpen;
        if (shouldOpen) {
            this.cancelPlacementIfActive();

            this.menuWasPaused = this.physics.paused;
            if (!this.physics.paused) {
                this.physics.togglePause();
                this.updateModeDisplay('Paused');
            }

            this.setPresetMenuActive(true);
            this.setControlsEnabled(false);
        } else {
            this.setPresetMenuActive(false);

            if (!this.menuWasPaused && this.physics.paused) {
                this.physics.togglePause();
                if (this.followedPlanet) {
                    this.updateModeDisplay('Follow Planet');
                } else if (this.followCOM) {
                    this.updateModeDisplay('Center of Mass');
                } else {
                    this.updateModeDisplay('Normal');
                }
            }

            this.setControlsEnabled(true);
        }
    }

    getDefaultSpinAxis() {
        const direction = new THREE.Vector3();
        this.renderer.camera.getWorldDirection(direction);
        direction.normalize();

        const up = this.renderer.camera.up.clone().normalize();
        const projected = up.clone().sub(direction.clone().multiplyScalar(up.dot(direction)));

        if (projected.lengthSq() < 1e-6) {
            projected.set(1, 0, 0);
        } else {
            projected.normalize();
        }

        return new Vector3(projected.x, projected.y, projected.z);
    }

    getSpinAxisLength() {
        const baseLength = Math.max(3, this.placementState.radius * 2.5);
        const rateRange = this.placementState.spinRateMax - this.placementState.spinRateMin;
        const normalized = rateRange > 0
            ? (this.placementState.spinRate - this.placementState.spinRateMin) / rateRange
            : 0;
        const clamped = Math.min(1, Math.max(0, normalized));
        if (clamped <= 0) {
            return 0;
        }
        return baseLength * clamped;
    }

    updateSpinArrow() {
        if (!this.placementState.position || !this.placementState.spinAxis) return;
        const origin = new THREE.Vector3(
            this.placementState.position.x,
            this.placementState.position.y,
            this.placementState.position.z
        );
        const axis = new THREE.Vector3(
            this.placementState.spinAxis.x,
            this.placementState.spinAxis.y,
            this.placementState.spinAxis.z
        );
        const length = this.getSpinAxisLength();
        const baseLength = Math.max(3, this.placementState.radius * 2.5);
        const fixedHeadLength = baseLength * 0.2;
        const fixedHeadWidth = baseLength * 0.1;
        const headLength = Math.min(fixedHeadLength, length * 0.8);
        const headWidth = Math.min(fixedHeadWidth, headLength * 0.6);
        if (axis.lengthSq() <= 1e-6) return;

        const axisNormalized = axis.normalize();
        if (this.placementState.previewMesh) {
            const up = new THREE.Vector3(0, 1, 0);
            this.placementState.previewMesh.quaternion.setFromUnitVectors(up, axisNormalized);
        }

        if (length <= 0.0001) {
            if (this.placementState.spinArrow) {
                this.renderer.removeVelocityArrow(this.placementState.spinArrow);
                this.placementState.spinArrow = null;
            }
            return;
        }

        if (this.placementState.spinArrow) {
            this.placementState.spinArrow.position.copy(origin);
            this.placementState.spinArrow.setDirection(axisNormalized);
            this.placementState.spinArrow.setLength(length, headLength, headWidth);
            this.placementState.spinArrow.setColor(new THREE.Color(this.placementState.color));
        } else {
            this.placementState.spinArrow = this.renderer.createAxisArrow(
                origin,
                axisNormalized,
                length,
                this.placementState.color,
                headLength,
                headWidth
            );
        }
    }

    applySpinTilt(baseAxis) {
        const planetPos = new THREE.Vector3(
            this.placementState.position.x,
            this.placementState.position.y,
            this.placementState.position.z
        );
        const cameraDir = new THREE.Vector3().subVectors(this.renderer.camera.position, planetPos);
        if (cameraDir.lengthSq() < 1e-6) {
            return baseAxis;
        }
        cameraDir.normalize();

        const tilt = this.placementState.spinTilt || 0;
        if (Math.abs(tilt) < 1e-6) {
            return baseAxis;
        }

        const targetDir = tilt > 0 ? cameraDir : cameraDir.clone().multiplyScalar(-1);
        const current = new THREE.Vector3(baseAxis.x, baseAxis.y, baseAxis.z).normalize();
        const angle = current.angleTo(targetDir);
        if (angle < 1e-6) {
            return baseAxis;
        }

        const rotationAxis = new THREE.Vector3().crossVectors(current, targetDir);
        if (rotationAxis.lengthSq() < 1e-6) {
            return baseAxis;
        }
        rotationAxis.normalize();

        const rotateBy = Math.min(Math.abs(tilt), angle);
        const quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, rotateBy);
        current.applyQuaternion(quaternion).normalize();
        return new Vector3(current.x, current.y, current.z);
    }

    getSpinAxisBaseFromCurrent() {
        if (!this.placementState.position || !this.placementState.spinAxis) return null;
        const planetPos = new THREE.Vector3(
            this.placementState.position.x,
            this.placementState.position.y,
            this.placementState.position.z
        );
        const cameraDir = new THREE.Vector3().subVectors(this.renderer.camera.position, planetPos);
        if (cameraDir.lengthSq() < 1e-6) {
            return this.placementState.spinAxis;
        }
        cameraDir.normalize();

        const current = new THREE.Vector3(
            this.placementState.spinAxis.x,
            this.placementState.spinAxis.y,
            this.placementState.spinAxis.z
        ).normalize();

        const projected = current.clone().sub(cameraDir.clone().multiplyScalar(current.dot(cameraDir)));
        if (projected.lengthSq() < 1e-6) {
            const fallback = new THREE.Vector3().crossVectors(cameraDir, new THREE.Vector3(0, 1, 0));
            if (fallback.lengthSq() < 1e-6) {
                fallback.set(1, 0, 0);
            }
            fallback.normalize();
            return new Vector3(fallback.x, fallback.y, fallback.z);
        }
        projected.normalize();
        return new Vector3(projected.x, projected.y, projected.z);
    }

    tiltSpinAxis(deltaY) {
        if (!this.placementState.position) return;

        const step = THREE.MathUtils.degToRad(5);
        const maxTilt = THREE.MathUtils.degToRad(80);
        const delta = deltaY < 0 ? -step : step; // scroll up = tilt away (negative)
        const nextTilt = Math.max(-maxTilt, Math.min(maxTilt, (this.placementState.spinTilt || 0) + delta));
        this.placementState.spinTilt = nextTilt;

        let baseAxis = this.placementState.spinAxisBase;
        if (!baseAxis || baseAxis.magSq() <= 1e-6) {
            baseAxis = this.getSpinAxisBaseFromCurrent();
            this.placementState.spinAxisBase = baseAxis;
        }
        if (!baseAxis) return;

        this.placementState.spinAxis = this.applySpinTilt(baseAxis);
        this.updateSpinArrow();
    }

    cancelPlacement() {
        this.renderer.removePreviewSphere(this.placementState.previewMesh);
        this.renderer.removeVelocityArrow(this.placementState.velocityArrow);
        this.renderer.removeVelocityArrow(this.placementState.spinArrow);
        this.placementState.previewMesh = null;
        this.placementState.velocityArrow = null;
        this.placementState.spinArrow = null;
        this.placementState.position = null;
        this.placementState.velocity = null;
        this.inputMode = 'normal';
        this.clearPlacementMessage();
        this.updateModeDisplay(this.followCOM ? 'Center of Mass' : 'Normal');

        // Hide mass display
        this.ui.planetMassStat.style.display = 'none';

        // Resume physics if it wasn't paused before placement
        if (!this.wasAlreadyPaused && this.physics.paused) {
            this.physics.togglePause();
        }

        // Re-enable orbit controls
        this.setControlsEnabled(true);
    }

    updateMassDisplay() {
        this.ui.planetMass.textContent = this.placementState.mass.toFixed(1);
    }

    toggleControls() {
        this.controlsVisible = !this.controlsVisible;
        this.ui.controls.style.display = this.controlsVisible ? 'block' : 'none';
    }

    toggleFollowCOM() {
        if (!this.followCOM) {
            this.clearFollowState();
            this.followCOM = true;
            // Will start tracking CoM on next frame
            this.showTemporaryMessage('Follow CoM ON');
            this.updateModeDisplay('Center of Mass');
        } else {
            this.clearFollowState();
            this.showTemporaryMessage('Follow CoM OFF');
            this.updateModeDisplay('Normal');
        }
    }

    followPlanet(planet) {
        this.clearFollowState();
        this.followedPlanet = planet;
        this.previousPlanetPos = null; // Will be set on next frame
        this.showTemporaryMessage('Following Planet');
        this.updateModeDisplay('Follow Planet');
    }

    clearFollowState() {
        this.followCOM = false;
        this.previousCOM = null;
        this.followedPlanet = null;
        this.previousPlanetPos = null;
    }

    clearBodies() {
        this.physics.clear();
        this.renderer.clearBodies();
    }

    // Reset core simulation state without recreating bodies.
    resetSimulationCore({ resetCamera = true } = {}) {
        this.clearBodies();
        if (resetCamera) {
            this.renderer.resetCamera();
        }
        this.clearFollowState();
        if (this.physics.paused) {
            this.physics.togglePause();
        }
        this.physics.showTrails = true;
        this.physics.resetTimeScale();
    }

    resetGame() {
        // Clear all bodies from physics and renderer
        this.resetSimulationCore();

        // Recreate initial bodies
        this.createInitialBodies();
        this.fitCameraToBodiesAround(new THREE.Vector3(0, 0, 0));
        this.scaleCameraDistance(0.9);

        // Update UI
        this.updateModeDisplay('Normal');
        this.showTemporaryMessage('Game Reset');
    }

    wipeAllBodies() {
        this.cancelPlacementIfActive();

        this.clearBodies();
        this.clearFollowState();

        if (this.physics.paused) {
            this.updateModeDisplay('Paused');
        } else {
            this.updateModeDisplay('Normal');
        }

        this.showTemporaryMessage('All bodies removed');
    }

    resetPresetCameraOverrides() {
        this.presetCameraCenter = null;
        this.presetCameraFitMode = null;
        this.presetCameraKeepDistance = false;
    }

    resetToPreset() {
        // Clear all bodies from physics and renderer
        this.resetSimulationCore();

        // Ensure placement state is clean
        this.inputMode = 'normal';
        this.ui.planetMassStat.style.display = 'none';

        // Update UI
        this.updateModeDisplay('Normal');
    }

    // Apply preset camera settings after bodies are created.
    applyPresetCamera(preset) {
        const center = this.presetCameraCenter || preset.cameraCenter || null;
        const fitMode = this.presetCameraFitMode || preset.cameraFitMode || 'bounds';
        if (preset.cameraReset) {
            this.renderer.resetCamera();
        }
        if (fitMode === 'around' && center) {
            this.fitCameraToBodiesAround(center);
        } else if (fitMode === 'bounds') {
            this.fitCameraToBodies();
        }

        const camera = this.renderer.camera;
        const controls = this.renderer.controls;

        if (typeof preset.cameraDistanceScale === 'number') {
            const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
            camera.position.copy(controls.target).add(offset.multiplyScalar(preset.cameraDistanceScale));
            controls.update();
        }
        if ((preset.cameraCenterKeepDistance || this.presetCameraKeepDistance) && center) {
            const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
            camera.position.copy(center).add(offset);
            controls.target.copy(center);
            controls.update();
        }
        if (typeof preset.cameraRightOffset === 'number') {
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);
            const right = forward.clone().cross(camera.up).normalize();
            const distance = camera.position.distanceTo(controls.target);
            camera.position.add(right.multiplyScalar(distance * preset.cameraRightOffset));
            controls.update();
        }
        if (typeof preset.cameraYawDeg === 'number') {
            const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
            const axis = camera.up.clone().normalize();
            offset.applyAxisAngle(axis, THREE.MathUtils.degToRad(preset.cameraYawDeg));
            camera.position.copy(controls.target).add(offset);
            controls.update();
        }
    }

    loadPreset(presetId) {
        const preset = this.presets.find((p) => p.id === presetId);
        if (!preset) return;

        this.resetToPreset();
        this.resetPresetCameraOverrides();
        preset.setup(this);
        this.balanceLinearMomentum();
        this.applyPresetCamera(preset);
        this.showTemporaryMessage(`Preset: ${preset.name}`);
    }

    fitCameraToBodies() {
        const bodies = this.physics.bodies;
        if (!bodies.length) return;

        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;

        for (const body of bodies) {
            minX = Math.min(minX, body.pos.x - body.radius);
            minY = Math.min(minY, body.pos.y - body.radius);
            minZ = Math.min(minZ, body.pos.z - body.radius);
            maxX = Math.max(maxX, body.pos.x + body.radius);
            maxY = Math.max(maxY, body.pos.y + body.radius);
            maxZ = Math.max(maxZ, body.pos.z + body.radius);
        }

        const center = new THREE.Vector3(
            (minX + maxX) / 2,
            (minY + maxY) / 2,
            (minZ + maxZ) / 2
        );

        const radius = Math.max(
            (maxX - minX) / 2,
            (maxY - minY) / 2,
            (maxZ - minZ) / 2,
            1
        );

        const camera = this.renderer.camera;
        const controls = this.renderer.controls;
        const fov = (camera.fov * Math.PI) / 180;
        const distance = (radius / Math.sin(fov / 2)) * 1.15;

        let offsetDir = new THREE.Vector3().subVectors(camera.position, controls.target);
        if (offsetDir.lengthSq() < 1e-6) {
            offsetDir.set(0, 0.4, 1);
        }
        offsetDir.normalize().multiplyScalar(distance);

        camera.position.copy(center).add(offsetDir);
        controls.target.copy(center);

        const neededFar = distance + radius * 2;
        if (camera.far < neededFar) {
            camera.far = neededFar;
            camera.updateProjectionMatrix();
        }

        controls.maxDistance = Math.max(controls.maxDistance, distance * 1.5);
        controls.update();
    }

    fitCameraToBodiesAround(center) {
        const bodies = this.physics.bodies;
        if (!bodies.length) return;

        let radius = 1;
        for (const body of bodies) {
            const dx = body.pos.x - center.x;
            const dy = body.pos.y - center.y;
            const dz = body.pos.z - center.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + body.radius;
            radius = Math.max(radius, dist);
        }

        const camera = this.renderer.camera;
        const controls = this.renderer.controls;
        const fov = (camera.fov * Math.PI) / 180;
        const distance = (radius / Math.sin(fov / 2)) * 1.15;

        let offsetDir = new THREE.Vector3().subVectors(camera.position, controls.target);
        if (offsetDir.lengthSq() < 1e-6) {
            offsetDir.set(0, 0.4, 1);
        }
        offsetDir.normalize().multiplyScalar(distance);

        camera.position.copy(center).add(offsetDir);
        controls.target.copy(center);

        const neededFar = distance + radius * 2;
        if (camera.far < neededFar) {
            camera.far = neededFar;
            camera.updateProjectionMatrix();
        }

        controls.maxDistance = Math.max(controls.maxDistance, distance * 1.5);
        controls.update();
    }

    scaleCameraDistance(scale) {
        const camera = this.renderer.camera;
        const controls = this.renderer.controls;
        const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
        if (offset.lengthSq() < 1e-6) return;
        camera.position.copy(controls.target).add(offset.multiplyScalar(scale));
        controls.update();
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
        const spinAxis = this.getRandomUnitVector();
        const spinRate = this.getRandomSpinRate();
        const body = new Body(position, velocity, mass, radius, color, spinAxis, spinRate);
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
            '#ffff00',
            this.getRandomUnitVector(),
            this.getRandomSpinRate()
        );
        this.physics.addBody(sun);

        // Orbiting planets
        const planets = [
            { distance: 25, mass: 3, radius: 1.5, color: '#ff6b35', speed: 0.15, phase: 0.5 },
            { distance: 58, mass: 4, radius: 2, color: '#4ecdc4', speed: 0.10, phase: 2.2 },
            { distance: 101, mass: 2, radius: 1.2, color: '#95e1d3', speed: 0.08, phase: 4.1 },
        ];

        for (const p of planets) {
            // Calculate orbital velocity for circular orbit
            const orbitalSpeed = Math.sqrt(this.physics.gConst * sun.mass / p.distance);
            const phase = typeof p.phase === 'number' ? p.phase : 0;
            const body = new Body(
                new Vector3(
                    p.distance * Math.cos(phase),
                    0,
                    p.distance * Math.sin(phase)
                ),
                new Vector3(
                    -Math.sin(phase) * orbitalSpeed,
                    0,
                    Math.cos(phase) * orbitalSpeed
                ),
                p.mass,
                p.radius,
                p.color,
                this.getRandomUnitVector(),
                this.getRandomSpinRate()
            );
            this.physics.addBody(body);
        }

        // Balance linear momentum so the system CoM stays near the origin
        this.balanceLinearMomentum();
    }

    buildPresets() {
        const tau = Math.PI * 2;
        const AU = 22;

        return [
            {
                id: 'solar',
                name: 'Solar System',
                description: 'Roughly scaled orbits with familiar planets.',
                cameraReset: true,
                cameraFitMode: 'none',
                cameraDistanceScale: 1.69,
                setup: (game) => {
                    const sun = game.addBodyFromPreset({
                        pos: new Vector3(0, 0, 0),
                        vel: new Vector3(0, 0, 0),
                        mass: 140,
                        radius: 3.2,
                        color: '#ffd54a',
                        spinAxis: new Vector3(0, 1, 0),
                        spinRate: 0.2
                    });

                    const planets = [
                        { distance: 0.39 * AU, mass: 0.08, radius: 0.35, color: '#b1b1b1', phase: 0.3, spinRate: 0.8 },
                        { distance: 0.72 * AU, mass: 0.25, radius: 0.6, color: '#d4a373', phase: 1.1, spinRate: 0.7 },
                        { distance: 1.0 * AU, mass: 0.5, radius: 0.75, color: '#4ecdc4', phase: 2.0, spinRate: 0.8 },
                        { distance: 1.52 * AU, mass: 0.15, radius: 0.5, color: '#ff6b35', phase: 2.8, spinRate: 0.7 },
                        { distance: 5.2 * AU, mass: 3.0, radius: 2.0, color: '#f0b27a', phase: 0.7, spinRate: 0.45 },
                        { distance: 9.58 * AU, mass: 2.5, radius: 1.8, color: '#f7dc6f', phase: 1.8, spinRate: 0.45 },
                        { distance: 19.2 * AU, mass: 1.5, radius: 1.4, color: '#85c1e9', phase: 3.0, spinRate: 0.5 },
                        { distance: 30.1 * AU, mass: 1.2, radius: 1.3, color: '#5dade2', phase: 4.1, spinRate: 0.5 }
                    ];

                    for (const planet of planets) {
                        game.addOrbitingBody(sun, planet.distance, {
                            mass: planet.mass,
                            radius: planet.radius,
                            color: planet.color,
                            phase: planet.phase,
                            spinRate: planet.spinRate
                        });
                    }
                }
            },
            {
                id: 'binary',
                name: 'Binary Stars',
                description: 'Two suns with circumbinary planets.',
                cameraDistanceScale: 1.0,
                cameraRightOffset: 0.64,
                cameraYawDeg: 30,
                setup: (game) => {
                    const star1Mass = 70;
                    const star2Mass = 55;
                    const separation = 28;
                    const totalMass = star1Mass + star2Mass;
                    const r1 = separation * (star2Mass / totalMass);
                    const r2 = separation * (star1Mass / totalMass);
                    const omega = Math.sqrt(game.physics.gConst * totalMass / Math.pow(separation, 3));

                    game.addBodyFromPreset({
                        pos: new Vector3(-r1, 0, 0),
                        vel: new Vector3(0, 0, omega * r1),
                        mass: star1Mass,
                        radius: 3.6,
                        color: '#ffd54a',
                        spinAxis: new Vector3(0, 1, 0),
                        spinRate: 0.2
                    });

                    game.addBodyFromPreset({
                        pos: new Vector3(r2, 0, 0),
                        vel: new Vector3(0, 0, -omega * r2),
                        mass: star2Mass,
                        radius: 3.0,
                        color: '#ff9f1c',
                        spinAxis: new Vector3(0, 1, 0),
                        spinRate: 0.2
                    });

                    const barycenter = {
                        pos: new Vector3(0, 0, 0),
                        vel: new Vector3(0, 0, 0),
                        mass: totalMass
                    };

                    game.addOrbitingBody(barycenter, 120, {
                        mass: 1.6,
                        radius: 1.1,
                        color: '#4ecdc4',
                        phase: 1.2,
                        spinRate: 0.5
                    });

                    game.addOrbitingBody(barycenter, 170, {
                        mass: 1.0,
                        radius: 0.9,
                        color: '#95e1d3',
                        phase: 3.4,
                        spinRate: 0.5
                    });
                }
            },
            {
                id: 'resonant',
                name: 'Resonant Chain',
                description: 'Planets in near orbital resonance.',
                cameraRightOffset: 0.15,
                cameraYawDeg: -15,
                setup: (game) => {
                    const sun = game.addBodyFromPreset({
                        pos: new Vector3(0, 0, 0),
                        vel: new Vector3(0, 0, 0),
                        mass: 120,
                        radius: 3.6,
                        color: '#ffe66d',
                        spinAxis: new Vector3(0, 1, 0),
                        spinRate: 0.2
                    });

                    const r1 = 22;
                    const ratios = [
                        1,
                        Math.pow(2, 2 / 3),
                        Math.pow(4, 2 / 3),
                        Math.pow(8, 2 / 3)
                    ];
                    const phases = [0.4, 1.4, 2.5, 3.2];
                    const masses = [0.8, 0.7, 0.6, 0.5];
                    const radii = [0.95, 0.9, 0.85, 0.8];
                    const colors = ['#4ecdc4', '#74b9ff', '#a29bfe', '#96ceb4'];
                    const spinRates = [0.6, 0.6, 0.5, 0.5];

                    for (let i = 0; i < ratios.length; i++) {
                        game.addOrbitingBody(sun, r1 * ratios[i], {
                            mass: masses[i],
                            radius: radii[i],
                            color: colors[i],
                            phase: phases[i],
                            spinRate: spinRates[i]
                        });
                    }
                }
            },
            {
                id: 'hot-jupiter',
                name: 'Hot Jupiter',
                description: 'A giant planet skimming its star.',
                setup: (game) => {
                    const sun = game.addBodyFromPreset({
                        pos: new Vector3(0, 0, 0),
                        vel: new Vector3(0, 0, 0),
                        mass: 130,
                        radius: 3.8,
                        color: '#ffd54a',
                        spinAxis: new Vector3(0, 1, 0),
                        spinRate: 0.2
                    });

                    game.addOrbitingBody(sun, 20, {
                        mass: 5.0,
                        radius: 1.8,
                        color: '#f4a261',
                        phase: 0.5,
                        spinRate: 0.5
                    });

                    game.addOrbitingBody(sun, 45, {
                        mass: 1.0,
                        radius: 0.9,
                        color: '#4ecdc4',
                        phase: 2.2,
                        spinRate: 0.6
                    });

                    game.addOrbitingBody(sun, 70, {
                        mass: 1.2,
                        radius: 1.0,
                        color: '#90be6d',
                        phase: 4.0,
                        spinRate: 0.6
                    });
                }
            },
            {
                id: 'trojan',
                name: 'Trojan Pair',
                description: 'Two planets share one orbit.',
                cameraFitMode: 'around',
                cameraCenter: new Vector3(0, 0, 0),
                cameraDistanceScale: 1.3,
                setup: (game) => {
                    const sun = game.addBodyFromPreset({
                        pos: new Vector3(0, 0, 0),
                        vel: new Vector3(0, 0, 0),
                        mass: 110,
                        radius: 3.5,
                        color: '#ffd54a',
                        spinAxis: new Vector3(0, 1, 0),
                        spinRate: 0.2
                    });

                    const distance = 40;
                    const phase = 0.2;

                    game.addOrbitingBody(sun, distance, {
                        mass: 1.6,
                        radius: 1.2,
                        color: '#4ecdc4',
                        phase,
                        spinRate: 0.5
                    });

                    game.addOrbitingBody(sun, distance, {
                        mass: 0.6,
                        radius: 0.8,
                        color: '#ffd166',
                        phase: phase + tau / 6,
                        spinRate: 0.5
                    });
                }
            },
            {
                id: 'rogue',
                name: 'Rogue Capture',
                description: 'An interloper swings through.',
                cameraDistanceScale: 1.375,
                cameraRightOffset: -0.2,
                cameraYawDeg: 35,
                setup: (game) => {
                    const sun = game.addBodyFromPreset({
                        pos: new Vector3(0, 0, 0),
                        vel: new Vector3(0, 0, 0),
                        mass: 130,
                        radius: 3.8,
                        color: '#ffe66d',
                        spinAxis: new Vector3(0, 1, 0),
                        spinRate: 0.2
                    });

                    game.addOrbitingBody(sun, 30, {
                        mass: 1.6,
                        radius: 1.1,
                        color: '#4ecdc4',
                        phase: 1.1,
                        spinRate: 0.6
                    });

                    game.addOrbitingBody(sun, 90, {
                        mass: 1.2,
                        radius: 0.9,
                        color: '#ff6b6b',
                        phase: 2.3,
                        inclination: 0.6,
                        speedFactor: 0.9,
                        spinRate: 0.5
                    });
                }
            },
            {
                id: 'shepherd',
                name: 'Shepherd Rings',
                description: 'A giant with a ring and shepherd moons.',
                cameraDistanceScale: 1.2,
                setup: (game) => {
                    const giant = game.addBodyFromPreset({
                        pos: new Vector3(0, 0, 0),
                        vel: new Vector3(0, 0, 0),
                        mass: 300,
                        radius: 4.8,
                        color: '#f7dc6f',
                        spinAxis: new Vector3(0, 1, 0),
                        spinRate: 0.2
                    });
                    game.presetCameraCenter = giant.pos.clone();
                    game.presetCameraKeepDistance = true;

                    const ringCount = 32;
                    const ringInner = 55;
                    const ringOuter = 70;

                    for (let i = 0; i < ringCount; i++) {
                        const distance = ringInner + Math.random() * (ringOuter - ringInner);
                        const phase = Math.random() * tau;
                        const inclination = (Math.random() - 0.5) * 0.02;
                        const mass = 0.002 + Math.random() * 0.002;
                        const radius = 0.03 + Math.random() * 0.02;
                        const speedFactor = 1 + (Math.random() - 0.5) * 0.002;
                        const spinRate = 0.2 + Math.random() * 0.1;

                        game.addOrbitingBody(giant, distance, {
                            mass,
                            radius,
                            color: '#dfe6e9',
                            phase,
                            inclination,
                            speedFactor,
                            spinRate
                        });
                    }

                    game.addOrbitingBody(giant, ringInner - 16, {
                        mass: 0.25,
                        radius: 0.6,
                        color: '#a29bfe',
                        phase: 0.8,
                        spinRate: 0.35
                    });

                    game.addOrbitingBody(giant, ringOuter + 16, {
                        mass: 0.2,
                        radius: 0.55,
                        color: '#74b9ff',
                        phase: 3.1,
                        spinRate: 0.35
                    });
                }
            },
            {
                id: 'random',
                name: 'Random System',
                description: 'Pure mess.',
                setup: (game) => {
                    const count = game.randomIntInclusive(3, 100);
                    for (let i = 0; i < count; i++) {
                        game.addRandomPlanet();
                    }
                }
            }
        ];
    }

    balanceLinearMomentum() {
        if (this.physics.bodies.length === 0) return;
        const totalMomentum = this.physics.bodies.reduce(
            (sum, body) => sum.add(body.velocity.mult(body.mass)),
            new Vector3(0, 0, 0)
        );
        const totalMass = this.physics.bodies.reduce((sum, body) => sum + body.mass, 0);
        if (totalMass > 0) {
            const correction = totalMomentum.div(totalMass);
            for (const body of this.physics.bodies) {
                body.velocity = body.velocity.sub(correction);
            }
        }
    }

    addBodyFromPreset({ pos, vel, mass, radius, color, spinAxis, spinRate }) {
        const axis = spinAxis || this.getRandomUnitVector();
        const rate = typeof spinRate === 'number' ? spinRate : this.getRandomSpinRate();
        const body = new Body(pos, vel, mass, radius, color, axis, rate);
        this.physics.addBody(body);
        return body;
    }

    addOrbitingBody(center, distance, options) {
        const {
            mass,
            radius,
            color,
            phase = 0,
            inclination = 0,
            speedFactor = 1,
            direction = 1,
            spinAxis,
            spinRate
        } = options;

        const centerVel = center.velocity || center.vel || new Vector3();
        let pos = new Vector3(
            distance * Math.cos(phase),
            0,
            distance * Math.sin(phase)
        );

        let velDir = new Vector3(
            -Math.sin(phase),
            0,
            Math.cos(phase)
        );

        const speed = Math.sqrt(this.physics.gConst * center.mass / distance) * speedFactor * direction;
        let vel = velDir.mult(speed);

        if (inclination !== 0) {
            pos = this.rotateAroundX(pos, inclination);
            vel = this.rotateAroundX(vel, inclination);
        }

        const inferredAxisRaw = pos.cross(vel);
        const inferredAxis = inferredAxisRaw.magSq() > 1e-6
            ? inferredAxisRaw.normalize()
            : new Vector3(0, 1, 0);
        const finalSpinAxis = spinAxis || inferredAxis;
        const finalSpinRate = typeof spinRate === 'number' ? spinRate : 0.4;

        const worldPos = center.pos.add(pos);
        const worldVel = centerVel.add(vel);

        return this.addBodyFromPreset({
            pos: worldPos,
            vel: worldVel,
            mass,
            radius,
            color,
            spinAxis: finalSpinAxis,
            spinRate: finalSpinRate
        });
    }

    rotateAroundX(vec, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector3(
            vec.x,
            vec.y * cos - vec.z * sin,
            vec.y * sin + vec.z * cos
        );
    }

    randomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
            '#dfe6e9', '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomUnitVector() {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        return new Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)
        );
    }

    getRandomSpinRate() {
        return this.placementState.spinRateMin +
            Math.random() * (this.placementState.spinRateMax - this.placementState.spinRateMin);
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
        if (this.isPlacing()) {
            this.showPlacementMessage(message);
            return;
        }
        this.clearPlacementMessage();
        this.ui.modeIndicator.textContent = message;
        this.ui.modeIndicator.classList.add('active');
        setTimeout(() => {
            this.ui.modeIndicator.classList.remove('active');
        }, this.messageDurationMs);
    }

    showPlacementMessage(message) {
        this.placementMessageActive = true;
        this.placementMessageText = message;
        this.ui.modeIndicator.textContent = message;
        this.ui.modeIndicator.classList.add('active');
        if (this.placementMessageTimeout) {
            clearTimeout(this.placementMessageTimeout);
        }
        this.placementMessageTimeout = setTimeout(() => {
            this.ui.modeIndicator.classList.remove('active');
            this.placementMessageActive = false;
            this.placementMessageTimeout = null;
        }, this.placementMessageDurationMs);
    }

    refreshPlacementMessage() {
        if (!this.placementMessageActive) return;
        this.showPlacementMessage(this.placementMessageText);
    }

    clearPlacementMessage() {
        if (this.placementMessageTimeout) {
            clearTimeout(this.placementMessageTimeout);
            this.placementMessageTimeout = null;
        }
        this.placementMessageActive = false;
        this.placementMessageText = '';
        this.ui.modeIndicator.classList.remove('active');
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

    clearTrails() {
        for (const body of this.physics.bodies) {
            body.trail = [];
        }
        if (this.renderer.clearTrails) {
            this.renderer.clearTrails();
        }
    }

    updateTrailReference() {
        let mode = 'world';
        let targetId = null;
        if (this.followedPlanet && this.physics.bodies.includes(this.followedPlanet)) {
            mode = 'planet';
            targetId = this.followedPlanet.id;
        } else if (this.followCOM) {
            mode = 'com';
        }

        // Changing reference frame invalidates existing trail segments.
        const modeChanged = mode !== this.trailReference.mode || targetId !== this.trailReference.targetId;
        if (modeChanged) {
            this.clearTrails();
        }

        this.trailReference.mode = mode;
        this.trailReference.targetId = targetId;
        return this.trailReference;
    }

    update() {
        this.updateFPS();

        // Pass followed planet ID to physics for collision tracking
        const followedId = this.followedPlanet ? this.followedPlanet.id : null;
        const trailReference = this.updateTrailReference();
        this.physics.update(followedId, trailReference);
        // Trail frame offset must be computed after physics to stay aligned.
        let trailFrameOrigin = new THREE.Vector3(0, 0, 0);
        if (trailReference.mode === 'com') {
            trailFrameOrigin = this.physics.getCenterOfMass();
        } else if (trailReference.mode === 'planet' && trailReference.targetId) {
            const target = this.physics.bodies.find((body) => body.id === trailReference.targetId);
            if (target) {
                trailFrameOrigin = target.pos;
            }
        }
        this.renderer.trailFrameOffset.set(trailFrameOrigin.x, trailFrameOrigin.y, trailFrameOrigin.z);

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
                const mergedPlanet = this.physics.bodies.find(b => b.id === followedId);
                if (mergedPlanet) {
                    // Planet merged! Update reference to the merged body
                    this.followedPlanet = mergedPlanet;
                    this.previousPlanetPos = null; // Reset to recalculate on next frame
                    this.showTemporaryMessage('Following merged planet');
                } else {
                    // Planet was deleted
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
        if (!this.menuOpen && !this.isPlacing()) {
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
        const lines = [
            '🌌 Wanderer - 3D Gravity Simulator',
            'Controls:',
            '  E - Add planet',
            '  Q - Add random planet',
            '  Click - Delete planet',
            '  WASD - Move camera',
            '  Alt+WASD - Rotate camera',
            '  Shift - Fast move',
            '  Mouse - Look around',
            '  Space - Pause/Resume',
            '  T - Toggle trails',
            '  F - Follow center of mass',
            '  R - Reset game',
            '  P - Wipe everything',
            '  M - Preset menu',
            '  Scroll - Zoom / Adjust planet size (during placement)',
            '  Spin placement - Drag axis, scroll speed, click to confirm'
        ];
        for (const line of lines) {
            console.log(line);
        }
        this.update();
    }
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Wanderer());
} else {
    new Wanderer();
}
