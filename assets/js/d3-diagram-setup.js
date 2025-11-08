// D3.js diagram setup
// Waits for DOM to be ready and D3 to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if D3 is loaded
  if (typeof d3 === 'undefined') {
    console.error('D3.js is not loaded');
    return;
  }

  // Initialize all D3 diagrams on the page
  const diagrams = document.querySelectorAll('[data-d3-diagram]');
  diagrams.forEach(diagram => {
    const diagramType = diagram.getAttribute('data-d3-diagram');

    // Call the appropriate diagram function based on type
    if (diagramType === 'italian-real-estate-structure') {
      initItalianRealEstateStructureDiagram(diagram);
    }
  });
});

// Italian Real Estate Project Structure Diagram
function initItalianRealEstateStructureDiagram(container) {
  const width = container.offsetWidth || 600;
  const height = 1600;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Define arrow marker (filled)
  svg.append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('markerWidth', 10)
    .attr('markerHeight', 10)
    .attr('refX', 9)
    .attr('refY', 3)
    .attr('orient', 'auto')
    .append('polygon')
    .attr('points', '0 0, 10 3, 0 6')
    .attr('fill', '#000');

  // Calculate center position
  const centerX = width / 2;

  // Define nodes with positions matching the original diagram
  const nodes = [
    // Row 1: immobiliare.it logo + "Web scraping" text + Airflow logo
    { id: 'immobiliare', x: centerX, y: 60, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 120, height: 40 },
    { id: 'airflow1', x: centerX + 150, y: 60, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 80, height: 40 },

    // Row 2: MongoDB logo + datalake icon
    { id: 'mongodb1', x: centerX, y: 180, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 120, height: 40 },
    { id: 'datalake', x: centerX, y: 250, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 60, height: 50 },

    // Row 3: "ETL pipeline" text + Airflow logo
    { id: 'airflow2', x: centerX + 150, y: 380, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 80, height: 40 },

    // Row 4: MongoDB logo + warehouse icon
    { id: 'mongodb2', x: centerX, y: 510, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 120, height: 40 },
    { id: 'warehouse_nonrel', x: centerX, y: 590, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 60, height: 50 },

    // Row 5: "ETL pipeline" text + Airflow logo
    { id: 'airflow3', x: centerX + 150, y: 720, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 80, height: 40 },

    // Row 6: PostgreSQL logo + warehouse icon
    { id: 'postgresql', x: centerX, y: 850, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 120, height: 40 },
    { id: 'warehouse_rel', x: centerX, y: 930, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 60, height: 50 },

    // Row 7: "Synthetic data generation" text (left) + scikit-learn logo (right)
    { id: 'sklearn1', x: centerX + 100, y: 1060, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 80, height: 60 },

    // Row 8: Document/data icon
    { id: 'synthetic_data', x: centerX, y: 1180, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 60, height: 50 },

    // Row 9: scikit-learn logo (left) + Tableau logo (right)
    { id: 'sklearn2', x: centerX - 200, y: 1310, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 80, height: 60 },
    { id: 'tableau', x: centerX + 120, y: 1310, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 100, height: 40 },

    // Row 10: ML models icon (left) + arrow + Dashboards icon (right)
    { id: 'ml_models', x: centerX - 200, y: 1480, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 60, height: 60 },
    { id: 'dashboards', x: centerX + 120, y: 1480, icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 60, height: 60 }
  ];

  // Define edges (arrows between nodes)
  const edges = [
    // Top to MongoDB datalake
    { from: 'immobiliare', to: 'mongodb1', label: 'Web scraping', labelSide: 'left' },

    // MongoDB to datalake icon
    { from: 'mongodb1', to: 'datalake', label: 'Data lake' },

    // Datalake to MongoDB warehouse
    { from: 'datalake', to: 'mongodb2', label: 'ETL pipeline', labelSide: 'left' },

    // MongoDB warehouse to warehouse icon
    { from: 'mongodb2', to: 'warehouse_nonrel', label: 'Data warehouse\n(non-relational)' },

    // Warehouse to PostgreSQL
    { from: 'warehouse_nonrel', to: 'postgresql', label: 'ETL pipeline', labelSide: 'left' },

    // PostgreSQL to warehouse icon
    { from: 'postgresql', to: 'warehouse_rel', label: 'Data warehouse\n(relational)' },

    // Warehouse to sklearn (synthetic generation)
    { from: 'warehouse_rel', to: 'sklearn1', label: 'Synthetic data\ngeneration with\ncustom algorithm\n(KNN-based)', labelSide: 'left' },

    // sklearn to synthetic data
    { from: 'sklearn1', to: 'synthetic_data', label: 'Synthetic data' },

    // Synthetic data splits to sklearn and tableau
    { from: 'synthetic_data', to: 'sklearn2', label: '' },
    { from: 'synthetic_data', to: 'tableau', label: '' },

    // sklearn to ML models
    { from: 'sklearn2', to: 'ml_models', label: 'ML models' },

    // Tableau to dashboards
    { from: 'tableau', to: 'dashboards', label: 'Dashboards' },

    // ML models to dashboards (horizontal arrow)
    { from: 'ml_models', to: 'dashboards', label: '', isHorizontal: true }
  ];

  // Draw edges first (so they appear behind nodes)
  const edgeGroup = svg.append('g').attr('class', 'edges');

  edges.forEach(edge => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);

    if (fromNode && toNode) {
      const fromY = fromNode.y + fromNode.height / 2;
      const toY = toNode.y - toNode.height / 2;

      if (edge.isHorizontal) {
        // Horizontal arrow
        edgeGroup.append('line')
          .attr('x1', fromNode.x + fromNode.width / 2)
          .attr('y1', fromNode.y)
          .attr('x2', toNode.x - toNode.width / 2)
          .attr('y2', toNode.y)
          .attr('stroke', '#000')
          .attr('stroke-width', 3)
          .attr('marker-end', 'url(#arrowhead)');
      } else {
        // Vertical arrow
        edgeGroup.append('line')
          .attr('x1', fromNode.x)
          .attr('y1', fromY)
          .attr('x2', toNode.x)
          .attr('y2', toY)
          .attr('stroke', '#000')
          .attr('stroke-width', 3)
          .attr('marker-end', 'url(#arrowhead)');

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
              .attr('font-size', '13px')
              .attr('font-family', 'Inter, sans-serif')
              .attr('fill', '#000')
              .text(line);
          });
        }
      }
    }
  });

  // Draw nodes on top
  const nodeGroup = svg.append('g').attr('class', 'nodes');

  nodes.forEach(node => {
    const nodeContainer = nodeGroup.append('g')
      .attr('transform', `translate(${node.x - node.width / 2}, ${node.y - node.height / 2})`);

    // Add image
    nodeContainer.append('image')
      .attr('xlink:href', node.icon)
      .attr('width', node.width)
      .attr('height', node.height)
      .attr('x', 0)
      .attr('y', 0)
      .style('object-fit', 'contain');
  });
}
