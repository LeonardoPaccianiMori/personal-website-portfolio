// D3.js diagram setup - Generic reusable function
// This can be called from any markdown file with custom node/edge configurations

/**
 * Renders a D3.js flowchart diagram
 * @param {string} selector - CSS selector for the container element (e.g., '#my-diagram')
 * @param {Object} config - Configuration object containing:
 *   - width: diagram width (default: container width or 600)
 *   - height: diagram height (default: 1600)
 *   - nodes: array of node objects {id, x, y, icon, width, height}
 *   - edges: array of edge objects {from, to, label, labelSide, isHorizontal}
 */
function renderD3Diagram(selector, config) {
  // Check if D3 is loaded
  if (typeof d3 === 'undefined') {
    console.error('D3.js is not loaded. Make sure d3_diagram: true is set in front matter.');
    return;
  }

  // Get container and set dimensions
  const container = d3.select(selector);
  if (container.empty()) {
    console.error(`Container not found: ${selector}`);
    return;
  }

  const width = config.width || container.node().offsetWidth || 600;
  const height = config.height || 1600;

  // Create SVG
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Define arrow marker (for edge endings)
  // Proportional arrowhead for thick lines
  svg.append('defs')
    .append('marker')
    .attr('id', `arrowhead-${selector.replace(/[^a-zA-Z0-9]/g, '')}`)
    .attr('markerWidth', 10)
    .attr('markerHeight', 10)
    .attr('refX', 8)
    .attr('refY', 3)
    .attr('orient', 'auto')
    .append('polygon')
    .attr('points', '0 0, 8 3, 0 6')
    .attr('fill', '#000');

  const markerId = `arrowhead-${selector.replace(/[^a-zA-Z0-9]/g, '')}`;

  // Draw edges first (so they appear behind nodes)
  const edgeGroup = svg.append('g').attr('class', 'edges');

  config.edges.forEach(edge => {
    const fromNode = config.nodes.find(n => n.id === edge.from);
    const toNode = config.nodes.find(n => n.id === edge.to);

    if (!fromNode || !toNode) {
      console.warn(`Edge references non-existent node: ${edge.from} -> ${edge.to}`);
      return;
    }

    // Skip drawing arrow if hideArrow is true (for vertical stacking without arrows)
    if (edge.hideArrow) {
      return;
    }

    const fromY = fromNode.y + (fromNode.height || 50) / 2;
    const toY = toNode.y - (toNode.height || 50) / 2;

    if (edge.isHorizontal) {
      // Horizontal arrow (left to right)
      edgeGroup.append('line')
        .attr('x1', fromNode.x + (fromNode.width || 50) / 2)
        .attr('y1', fromNode.y)
        .attr('x2', toNode.x - (toNode.width || 50) / 2)
        .attr('y2', toNode.y)
        .attr('stroke', edge.color || '#000')
        .attr('stroke-width', edge.width || 5)
        .attr('marker-end', `url(#${markerId})`);
    } else {
      // Vertical arrow (top to bottom)
      edgeGroup.append('line')
        .attr('x1', fromNode.x)
        .attr('y1', fromY)
        .attr('x2', toNode.x)
        .attr('y2', toY)
        .attr('stroke', edge.color || '#000')
        .attr('stroke-width', edge.width || 5)
        .attr('marker-end', `url(#${markerId})`);

      // Draw label if exists
      if (edge.label) {
        const midY = (fromY + toY) / 2;
        const labelX = edge.labelSide === 'left' ? fromNode.x - 80 : fromNode.x + 80;
        const lines = edge.label.split('\n');

        lines.forEach((line, i) => {
          edgeGroup.append('text')
            .attr('x', labelX)
            .attr('y', midY + (i * 16) - ((lines.length - 1) * 8))
            .attr('text-anchor', 'middle')
            .attr('font-size', edge.fontSize || '13px')
            .attr('font-family', 'Inter, sans-serif')
            .attr('fill', edge.labelColor || '#000')
            .text(line);
        });
      }
    }
  });

  // Draw nodes on top
  const nodeGroup = svg.append('g').attr('class', 'nodes');

  config.nodes.forEach(node => {
    const nodeWidth = node.width || 60;
    const nodeHeight = node.height || 60;

    const nodeContainer = nodeGroup.append('g')
      .attr('transform', `translate(${node.x - nodeWidth / 2}, ${node.y - nodeHeight / 2})`);

    // Add image/icon
    if (node.icon) {
      nodeContainer.append('image')
        .attr('xlink:href', node.icon)
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('x', 0)
        .attr('y', 0)
        .style('object-fit', 'contain');
    }

    // Add label below node if exists
    if (node.label) {
      const lines = node.label.split('\n');
      const textGroup = nodeContainer.append('g')
        .attr('transform', `translate(${nodeWidth / 2}, ${nodeHeight + 15})`);

      lines.forEach((line, i) => {
        textGroup.append('text')
          .attr('y', i * 14)
          .attr('text-anchor', 'middle')
          .attr('font-size', node.labelFontSize || '12px')
          .attr('font-family', 'Inter, sans-serif')
          .attr('fill', node.labelColor || '#000')
          .text(line);
      });
    }
  });
}
