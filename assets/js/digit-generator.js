/**
 * Digit Generator Widget
 *
 * Uses DCGAN-4 with discovered seed vectors to generate
 * handwritten digit images in the browser using TensorFlow.js.
 *
 * Instead of a conditional GAN, this uses "latent space inversion" -
 * pre-discovered noise vectors that reliably produce each digit class.
 */

(function() {
    'use strict';

    // Model configuration
    const NOISE_DIM = 100;
    const IMAGE_SIZE = 28;
    const DISPLAY_SIZE = 140;
    const PERTURBATION_SCALE = 0.1;  // Small random variation

    // State
    let model = null;
    let digitSeeds = null;
    let isLoading = false;

    // DOM elements (initialized on load)
    let digitSelect = null;
    let generateBtn = null;
    let randomBtn = null;
    let loadingIndicator = null;
    let outputCanvas = null;
    let statusText = null;

    /**
     * Initialize the widget when DOM is ready
     */
    function init() {
        digitSelect = document.getElementById('digit-select');
        generateBtn = document.getElementById('generate-btn');
        randomBtn = document.getElementById('random-btn');
        loadingIndicator = document.getElementById('loading-indicator');
        outputCanvas = document.getElementById('output-canvas');
        statusText = document.getElementById('status-text');

        if (!outputCanvas) {
            console.error('Digit generator canvas not found');
            return;
        }

        // Set up event listeners
        if (generateBtn) {
            generateBtn.addEventListener('click', handleGenerate);
        }
        if (randomBtn) {
            randomBtn.addEventListener('click', handleRandom);
        }

        // Draw placeholder
        drawPlaceholder();
    }

    /**
     * Draw a placeholder message on the canvas
     */
    function drawPlaceholder() {
        const ctx = outputCanvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
        ctx.fillStyle = '#666';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Click Generate', DISPLAY_SIZE / 2, DISPLAY_SIZE / 2 - 10);
        ctx.fillText('to create a digit', DISPLAY_SIZE / 2, DISPLAY_SIZE / 2 + 10);
    }

    /**
     * Load the TensorFlow.js model and seed vectors
     */
    async function loadModel() {
        if (model && digitSeeds) return { model, digitSeeds };
        if (isLoading) return null;

        isLoading = true;
        showLoading(true);
        updateStatus('Loading model...');

        try {
            // Get the base URL for the model
            const baseUrl = window.location.origin;
            const modelUrl = `${baseUrl}/assets/models/dcgan/model.json`;
            const seedsUrl = `${baseUrl}/assets/models/dcgan/digit_seeds.json`;

            // Load model and seeds in parallel
            console.log('Loading model from:', modelUrl);
            console.log('Loading seeds from:', seedsUrl);

            const [loadedModel, seedsResponse] = await Promise.all([
                tf.loadLayersModel(modelUrl),
                fetch(seedsUrl)
            ]);

            model = loadedModel;
            digitSeeds = await seedsResponse.json();

            console.log('Model loaded successfully');
            console.log('Seeds loaded:', Object.keys(digitSeeds).length, 'digit classes');
            updateStatus('Model loaded!');

            // Warm up the model with a dummy prediction
            const dummyInput = tf.zeros([1, NOISE_DIM]);
            model.predict(dummyInput).dispose();
            dummyInput.dispose();

        } catch (error) {
            console.error('Error loading model:', error);
            updateStatus('Error loading model. Check console.');
            model = null;
            digitSeeds = null;
        } finally {
            isLoading = false;
            showLoading(false);
        }

        return { model, digitSeeds };
    }

    /**
     * Generate a digit image using seed vectors
     * @param {number} digit - The digit to generate (0-9)
     */
    async function generateDigit(digit) {
        const resources = await loadModel();
        if (!resources || !resources.model || !resources.digitSeeds) return;

        updateStatus(`Generating ${digit}...`);

        const seedKey = `digit_${digit}`;
        const seeds = digitSeeds[seedKey];

        if (!seeds || seeds.length === 0) {
            updateStatus(`No seeds for digit ${digit}`);
            return;
        }

        // Pick a random seed for this digit
        const seedIdx = Math.floor(Math.random() * seeds.length);
        const seed = seeds[seedIdx];

        // Create tensor from seed and add small perturbation for variety
        const seedTensor = tf.tensor2d([seed], [1, NOISE_DIM]);
        const perturbation = tf.randomNormal([1, NOISE_DIM], 0, PERTURBATION_SCALE);
        const input = seedTensor.add(perturbation);

        // Generate image
        const output = model.predict(input);

        // Convert to image data
        const imageData = await output.data();

        // Draw to canvas
        drawImage(imageData);

        // Clean up tensors
        seedTensor.dispose();
        perturbation.dispose();
        input.dispose();
        output.dispose();

        updateStatus(`Generated digit ${digit}`);
    }

    /**
     * Draw generated image data to the canvas
     * @param {Float32Array} imageData - Flattened 28x28 image data
     */
    function drawImage(imageData) {
        const ctx = outputCanvas.getContext('2d');

        // Create image data at original size
        const imgData = ctx.createImageData(IMAGE_SIZE, IMAGE_SIZE);

        for (let i = 0; i < IMAGE_SIZE * IMAGE_SIZE; i++) {
            // Convert from [0, 1] to [0, 255]
            const value = Math.floor(Math.max(0, Math.min(1, imageData[i])) * 255);
            const idx = i * 4;
            imgData.data[idx] = value;     // R
            imgData.data[idx + 1] = value; // G
            imgData.data[idx + 2] = value; // B
            imgData.data[idx + 3] = 255;   // A
        }

        // Create temporary canvas at original size
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = IMAGE_SIZE;
        tempCanvas.height = IMAGE_SIZE;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imgData, 0, 0);

        // Draw scaled up to display canvas with nearest-neighbor scaling
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    }

    /**
     * Handle generate button click
     */
    async function handleGenerate() {
        const digit = parseInt(digitSelect.value, 10);
        await generateDigit(digit);
    }

    /**
     * Handle random button click
     */
    async function handleRandom() {
        const digit = Math.floor(Math.random() * 10);
        digitSelect.value = digit;
        await generateDigit(digit);
    }

    /**
     * Show/hide loading indicator
     */
    function showLoading(show) {
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'block' : 'none';
        }
        if (generateBtn) {
            generateBtn.disabled = show;
        }
        if (randomBtn) {
            randomBtn.disabled = show;
        }
    }

    /**
     * Update status text
     */
    function updateStatus(message) {
        if (statusText) {
            statusText.textContent = message;
        }
        console.log('Digit Generator:', message);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.digitGenerator = {
        loadModel,
        generateDigit,
        getModel: () => model,
        getSeeds: () => digitSeeds
    };
})();
