/**
 * CVAE Latent Space Explorer Widget
 *
 * Interactive visualization of the CVAE latent space. Users can click
 * anywhere in the 2D latent space to generate the corresponding digit
 * using the CVAE decoder running in TensorFlow.js.
 */

(function() {
    'use strict';

    // Model configuration
    const LATENT_DIM = 2;
    const IMAGE_SIZE = 28;
    const DISPLAY_SIZE = 140;

    // State
    let model = null;
    let isLoading = false;
    let plotlyData = null;
    let plotDiv = null;
    let markerX = 5;  // Initial marker position
    let markerY = 5;

    // DOM elements
    let container = null;
    let outputCanvas = null;
    let statusText = null;
    let coordsText = null;
    let loadingIndicator = null;

    /**
     * Initialize the widget when DOM is ready
     */
    async function init() {
        container = document.getElementById('cvae-explorer');
        if (!container) {
            console.log('CVAE explorer container not found');
            return;
        }

        plotDiv = document.getElementById('cvae-latent-plot');
        outputCanvas = document.getElementById('cvae-output-canvas');
        statusText = document.getElementById('cvae-status-text');
        coordsText = document.getElementById('cvae-coords-text');
        loadingIndicator = document.getElementById('cvae-loading');

        // Draw placeholder on canvas
        drawPlaceholder();

        // Load plot data and initialize
        try {
            await loadPlotData();
            initPlot();
        } catch (error) {
            console.error('Error initializing CVAE explorer:', error);
            updateStatus('Error loading data');
        }
    }

    /**
     * Load the Plotly JSON data (cvae-1-latent-space.json)
     */
    async function loadPlotData() {
        const baseUrl = window.location.origin;
        const dataUrl = `${baseUrl}/assets/js/cvae-1-latent-space.json`;

        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error(`Failed to load plot data: ${response.status}`);
        }
        plotlyData = await response.json();
        console.log('Plot data loaded');
    }

    /**
     * Initialize the Plotly scatter plot with clickable marker
     */
    function initPlot() {
        if (!plotlyData || !plotDiv) return;

        // Use the existing data from the Plotly JSON
        const traces = [...plotlyData.data];

        // Add marker trace (will be moved via click)
        traces.push({
            x: [markerX],
            y: [markerY],
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: '#FF0000',
                size: 18,
                symbol: 'x',
                line: {
                    color: '#000000',
                    width: 2
                }
            },
            name: 'Generator',
            hoverinfo: 'skip',
            showlegend: false
        });

        // Layout with transparent background for theme compatibility
        const layout = {
            ...plotlyData.layout,
            title: {
                text: 'CVAE-1 Latent Space (click to generate)',
                font: { size: 14 }
            },
            hovermode: 'closest',
            dragmode: false,  // Disable pan/zoom to allow click-anywhere
            showlegend: false,  // Hide legend to avoid "trace 0" text
            margin: { t: 50, b: 50, l: 60, r: 20 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        const config = {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d', 'pan2d', 'zoom2d'],
            displaylogo: false,
            scrollZoom: false
        };

        Plotly.newPlot(plotDiv, traces, layout, config);

        // Add click handler
        setupClickHandler();

        updateStatus('Click anywhere in the plot to generate a digit');
    }

    /**
     * Set up click handler that works anywhere on the plot
     */
    function setupClickHandler() {
        // Get the plot area element
        const plotArea = plotDiv.querySelector('.nsewdrag');
        if (!plotArea) {
            console.warn('Plot area not found, falling back to plotly_click');
            plotDiv.on('plotly_click', handlePlotClick);
            return;
        }

        // Simple click handler
        plotArea.addEventListener('click', handleClick);

        // Also handle touch for mobile
        plotArea.addEventListener('touchend', handleTouch);
    }

    /**
     * Convert pixel coordinates to data coordinates
     */
    function pixelToData(pixelX, pixelY) {
        const xaxis = plotDiv._fullLayout.xaxis;
        const yaxis = plotDiv._fullLayout.yaxis;

        // Get plot area bounds
        const plotArea = plotDiv.querySelector('.nsewdrag');
        const rect = plotArea.getBoundingClientRect();

        // Calculate relative position within plot area (0 to 1)
        const relX = (pixelX - rect.left) / rect.width;
        const relY = (pixelY - rect.top) / rect.height;

        // Convert to data coordinates
        const dataX = xaxis.range[0] + relX * (xaxis.range[1] - xaxis.range[0]);
        const dataY = yaxis.range[1] - relY * (yaxis.range[1] - yaxis.range[0]); // Y is inverted

        return { x: dataX, y: dataY };
    }

    /**
     * Handle click on plot area
     */
    function handleClick(event) {
        event.preventDefault();
        const coords = pixelToData(event.clientX, event.clientY);
        moveMarkerAndGenerate(coords.x, coords.y);
    }

    /**
     * Handle touch on plot area
     */
    function handleTouch(event) {
        if (event.changedTouches && event.changedTouches.length > 0) {
            const touch = event.changedTouches[0];
            const coords = pixelToData(touch.clientX, touch.clientY);
            moveMarkerAndGenerate(coords.x, coords.y);
        }
    }

    /**
     * Move marker to position (without generating)
     */
    function moveMarker(z1, z2) {
        markerX = z1;
        markerY = z2;

        // Update the marker trace (last trace)
        const markerTraceIndex = plotDiv.data.length - 1;
        Plotly.restyle(plotDiv, {
            x: [[z1]],
            y: [[z2]]
        }, markerTraceIndex);

        // Update coordinates display
        if (coordsText) {
            coordsText.textContent = `z1: ${z1.toFixed(2)}, z2: ${z2.toFixed(2)}`;
        }
    }

    /**
     * Move marker and trigger generation
     */
    async function moveMarkerAndGenerate(z1, z2) {
        moveMarker(z1, z2);
        await generateFromLatent(z1, z2);
    }

    /**
     * Fallback click handler (for data points)
     */
    async function handlePlotClick(data) {
        if (!data || !data.points || data.points.length === 0) return;

        const point = data.points[0];
        await moveMarkerAndGenerate(point.x, point.y);
    }

    /**
     * Load the CVAE decoder model
     */
    async function loadModel() {
        if (model) return model;
        if (isLoading) return null;

        isLoading = true;
        showLoading(true);
        updateStatus('Loading CVAE decoder...');

        try {
            const baseUrl = window.location.origin;
            const modelUrl = `${baseUrl}/assets/models/cvae/model.json`;

            console.log('Loading CVAE model from:', modelUrl);
            model = await tf.loadLayersModel(modelUrl);
            console.log('CVAE model loaded successfully');

            // Warm up with dummy prediction
            const dummy = tf.zeros([1, LATENT_DIM]);
            model.predict(dummy).dispose();
            dummy.dispose();

            updateStatus('Model loaded! Click to generate.');
        } catch (error) {
            console.error('Error loading CVAE model:', error);
            updateStatus('Error loading model');
            model = null;
        } finally {
            isLoading = false;
            showLoading(false);
        }

        return model;
    }

    /**
     * Generate an image from latent coordinates
     */
    async function generateFromLatent(z1, z2) {
        if (!model) {
            model = await loadModel();
            if (!model) return;
        }

        updateStatus('Generating...');

        // Create latent vector input
        const latent = tf.tensor2d([[z1, z2]]);

        // Generate image
        const output = model.predict(latent);

        // Get image data
        const imageData = await output.data();

        // Draw to canvas
        drawImage(imageData);

        // Cleanup
        latent.dispose();
        output.dispose();

        updateStatus(`Generated from (${z1.toFixed(2)}, ${z2.toFixed(2)})`);
    }

    /**
     * Draw generated image data to the canvas
     */
    function drawImage(imageData) {
        const ctx = outputCanvas.getContext('2d');

        // Create image data at original size
        const imgData = ctx.createImageData(IMAGE_SIZE, IMAGE_SIZE);

        for (let i = 0; i < IMAGE_SIZE * IMAGE_SIZE; i++) {
            const value = Math.floor(Math.min(1, Math.max(0, imageData[i])) * 255);
            const idx = i * 4;
            imgData.data[idx] = value;
            imgData.data[idx + 1] = value;
            imgData.data[idx + 2] = value;
            imgData.data[idx + 3] = 255;
        }

        // Create temporary canvas at original size
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = IMAGE_SIZE;
        tempCanvas.height = IMAGE_SIZE;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imgData, 0, 0);

        // Draw scaled up with nearest-neighbor
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    }

    /**
     * Draw placeholder on canvas
     */
    function drawPlaceholder() {
        if (!outputCanvas) return;
        const ctx = outputCanvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Click on the', DISPLAY_SIZE / 2, DISPLAY_SIZE / 2 - 15);
        ctx.fillText('latent space', DISPLAY_SIZE / 2, DISPLAY_SIZE / 2);
        ctx.fillText('to generate', DISPLAY_SIZE / 2, DISPLAY_SIZE / 2 + 15);
    }

    /**
     * Show/hide loading indicator
     */
    function showLoading(show) {
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Update status text
     */
    function updateStatus(message) {
        if (statusText) {
            statusText.textContent = message;
        }
        console.log('CVAE Explorer:', message);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.cvaeExplorer = {
        loadModel,
        generateFromLatent,
        getModel: () => model,
        getPlotData: () => plotlyData
    };
})();
