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
  const width = container.offsetWidth || 800;
  const height = 1400;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Define arrow marker
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

  // Define nodes with positions
  const nodes = [
    // Top: immobiliare.it
    { id: 'immobiliare', x: centerX, y: 50, label: 'immobiliare.it', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 60, height: 60 },

    // Airflow 1
    { id: 'airflow1', x: centerX + 120, y: 100, label: 'Apache Airflow', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },

    // MongoDB Datalake
    { id: 'mongodb_datalake', x: centerX, y: 200, label: 'MongoDB\nData lake', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 60, height: 60 },
    { id: 'datalake_icon', x: centerX, y: 280, label: '', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },

    // Airflow 2
    { id: 'airflow2', x: centerX + 120, y: 380, label: 'Apache Airflow', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },

    // MongoDB Warehouse
    { id: 'mongodb_warehouse', x: centerX, y: 480, label: 'MongoDB\nData warehouse\n(non-relational)', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 60, height: 60 },
    { id: 'warehouse_icon', x: centerX, y: 570, label: '', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },

    // Airflow 3
    { id: 'airflow3', x: centerX + 120, y: 670, label: 'Apache Airflow', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },

    // PostgreSQL
    { id: 'postgresql', x: centerX, y: 770, label: 'PostgreSQL', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 60, height: 60 },
    { id: 'postgres_warehouse', x: centerX, y: 860, label: 'Data warehouse\n(relational)', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },

    // Synthetic data generation
    { id: 'synthetic_gen', x: centerX - 100, y: 960, label: 'Synthetic data\ngeneration with\ncustom algorithm\n(KNN-based)', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },
    { id: 'sklearn_gen', x: centerX + 100, y: 960, label: 'scikit-learn', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },

    // Synthetic data output
    { id: 'synthetic_data', x: centerX, y: 1080, label: 'Synthetic data', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },

    // Bottom branches
    { id: 'sklearn_ml', x: centerX - 150, y: 1200, label: 'scikit-learn', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },
    { id: 'tableau', x: centerX + 150, y: 1200, label: 'Tableau', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },

    // Final outputs
    { id: 'ml_models', x: centerX - 150, y: 1320, label: 'ML models', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 },
    { id: 'dashboards', x: centerX + 150, y: 1320, label: 'Dashboards', icon: 'assets/img/projects/italian-real-estate/placeholder.jpg', width: 50, height: 50 }
  ];

  // Define edges
  const edges = [
    { from: 'immobiliare', to: 'mongodb_datalake', label: 'Web scraping' },
    { from: 'mongodb_datalake', to: 'datalake_icon', label: '' },
    { from: 'datalake_icon', to: 'mongodb_warehouse', label: 'ETL pipeline' },
    { from: 'mongodb_warehouse', to: 'warehouse_icon', label: '' },
    { from: 'warehouse_icon', to: 'postgresql', label: 'ETL pipeline' },
    { from: 'postgresql', to: 'postgres_warehouse', label: '' },
    { from: 'postgres_warehouse', to: 'synthetic_gen', label: '' },
    { from: 'postgres_warehouse', to: 'sklearn_gen', label: '' },
    { from: 'synthetic_gen', to: 'synthetic_data', label: '' },
    { from: 'sklearn_gen', to: 'synthetic_data', label: '' },
    { from: 'synthetic_data', to: 'sklearn_ml', label: '' },
    { from: 'synthetic_data', to: 'tableau', label: '' },
    { from: 'sklearn_ml', to: 'ml_models', label: '' },
    { from: 'tableau', to: 'dashboards', label: '' }
  ];

  // Draw edges
  const edgeGroup = svg.append('g').attr('class', 'edges');

  edges.forEach(edge => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);

    if (fromNode && toNode) {
      // Draw line
      edgeGroup.append('line')
        .attr('x1', fromNode.x)
        .attr('y1', fromNode.y + fromNode.height / 2)
        .attr('x2', toNode.x)
        .attr('y2', toNode.y - toNode.height / 2)
        .attr('stroke', '#000')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');

      // Draw label if exists
      if (edge.label) {
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + fromNode.height / 2 + toNode.y - toNode.height / 2) / 2;

        edgeGroup.append('text')
          .attr('x', midX + 10)
          .attr('y', midY)
          .attr('text-anchor', 'start')
          .attr('font-size', '12px')
          .attr('fill', '#000')
          .text(edge.label);
      }
    }
  });

  // Draw nodes
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
      .attr('y', 0);

    // Add label if exists
    if (node.label) {
      const lines = node.label.split('\n');
      const textGroup = nodeContainer.append('g')
        .attr('transform', `translate(${node.width / 2}, ${node.height + 15})`);

      lines.forEach((line, i) => {
        textGroup.append('text')
          .attr('y', i * 14)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('font-family', 'Inter, sans-serif')
          .attr('fill', '#000')
          .text(line);
      });
    }
  });
}
