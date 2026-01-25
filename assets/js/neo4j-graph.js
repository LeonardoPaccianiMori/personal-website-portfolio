document.addEventListener("DOMContentLoaded", () => {
  const graphContainers = document.querySelectorAll("[data-neo4j-graph]");

  graphContainers.forEach((container) => {
    const src = container.dataset.graphSrc;
    const canvas = container.querySelector("[data-neo4j-graph-canvas]");
    const panel = container.querySelector("[data-neo4j-graph-panel]");
    const titleEl = container.querySelector("[data-neo4j-graph-title]");
    const bodyEl = container.querySelector("[data-neo4j-graph-body]");

    if (!src || !canvas || !panel || !titleEl || !bodyEl) {
      return;
    }

    if (!window.vis || !window.vis.Network || !window.vis.DataSet) {
      titleEl.textContent = "Graph unavailable";
      bodyEl.textContent = "vis-network failed to load.";
      return;
    }

    fetch(src)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load graph data: ${response.status}`);
        }
        return response.json();
      })
      .then((graphData) => {
        const nodes = new vis.DataSet(
          graphData.nodes.map((node) => ({
            id: node.id,
            label: node.label,
            group: node.group,
            title: buildNodeTooltip(node),
            meta: node.meta,
          }))
        );

        const edges = new vis.DataSet(
          graphData.edges.map((edge, index) => ({
            id: `edge:${index}`,
            from: edge.from,
            to: edge.to,
            color: edgeColor(edge.type),
            title: buildEdgeTooltip(edge),
            meta: { type: edge.type, ...edge.meta },
          }))
        );

        const options = buildNetworkOptions();
        const network = new vis.Network(canvas, { nodes, edges }, options);

        const defaultMessage =
          "Zoom in for more detail. Click a node or relationship to inspect metadata. Drag nodes to rearrange the graph.";

        titleEl.textContent = "Graph details";
        bodyEl.textContent = defaultMessage;

        network.on("click", (params) => {
          if (params.nodes.length > 0) {
            const node = nodes.get(params.nodes[0]);
            renderPanel(node, titleEl, bodyEl);
            return;
          }

          if (params.edges.length > 0) {
            const edge = edges.get(params.edges[0]);
            renderPanel(edge, titleEl, bodyEl);
            return;
          }

          titleEl.textContent = "Graph details";
          bodyEl.textContent = defaultMessage;
        });
      })
      .catch((error) => {
        titleEl.textContent = "Graph unavailable";
        bodyEl.textContent = error.message;
      });
  });
});

function buildNetworkOptions() {
  return {
    layout: {
      improvedLayout: true,
    },
    interaction: {
      hover: true,
      dragNodes: true,
      dragView: true,
      tooltipDelay: 120,
    },
    nodes: {
      borderWidth: 1,
      size: 16,
      physics: true,
      font: {
        color: "#f8f9fa",
        face: "Inter, sans-serif",
        size: 12,
      },
    },
    edges: {
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.6,
        },
      },
      width: 1.2,
      smooth: {
        type: "dynamic",
      },
      font: {
        color: "#dfe4ea",
        size: 10,
        align: "middle",
      },
    },
    groups: {
      step: {
        shape: "box",
        color: {
          background: "#2c7da0",
          border: "#61a5c2",
        },
      },
      ingredient: {
        shape: "ellipse",
        color: {
          background: "#b08968",
          border: "#ddb892",
        },
      },
      tool: {
        shape: "hexagon",
        color: {
          background: "#6c757d",
          border: "#adb5bd",
        },
      },
      intermediate: {
        shape: "diamond",
        color: {
          background: "#4f772d",
          border: "#90a955",
        },
      },
    },
    physics: {
      enabled: true,
      solver: "forceAtlas2Based",
      forceAtlas2Based: {
        gravitationalConstant: -30,
        centralGravity: 0.01,
        springLength: 120,
        springConstant: 0.08,
        damping: 0.6,
        avoidOverlap: 0.7,
      },
      stabilization: {
        enabled: false,
      },
    },
  };
}

function buildNodeTooltip(node) {
  const meta = node.meta || {};
  const wrapper = document.createElement("div");
  const title = document.createElement("div");
  title.innerHTML = `<strong>${escapeHtml(node.label)}</strong>`;
  wrapper.appendChild(title);
  appendMetaHtml(wrapper, meta, { instructionLimit: 140 });
  return wrapper;
}

function buildEdgeTooltip(edge) {
  const meta = { type: edge.type, ...edge.meta };
  const wrapper = document.createElement("div");
  const title = document.createElement("div");
  title.innerHTML = `<strong>${escapeHtml(edge.type)}</strong>`;
  wrapper.appendChild(title);
  appendMetaHtml(wrapper, meta, { instructionLimit: 0, skipType: true });
  return wrapper;
}

function edgeColor(type) {
  const palette = {
    USES_TOOL: "#adb5bd",
    USES_INGREDIENT: "#ddb892",
    PRODUCES: "#90a955",
    INPUT_TO: "#61a5c2",
  };

  return palette[type] || "#94a3b8";
}

function appendMetaLines(lines, meta, options) {
  const { instructionLimit, skipType } = options;
  const entries = Object.entries(meta).filter(([, value]) =>
    value !== null && value !== undefined && value !== ""
  );

  entries.forEach(([key, value]) => {
    if (skipType && key === "type") {
      return;
    }
    if (key === "instruction" && instructionLimit !== undefined && instructionLimit > 0) {
      lines.push(`${formatKey(key)}: ${truncate(String(value), instructionLimit)}`);
      return;
    }
    if (key === "instruction" && instructionLimit === 0) {
      return;
    }
    lines.push(`${formatKey(key)}: ${formatValue(value)}`);
  });
}

function appendMetaHtml(container, meta, options) {
  const { instructionLimit, skipType } = options;
  const entries = Object.entries(meta).filter(([, value]) =>
    value !== null && value !== undefined && value !== ""
  );

  entries.forEach(([key, value]) => {
    if (skipType && key === "type") {
      return;
    }
    if (key === "instruction" && instructionLimit === 0) {
      return;
    }

    const line = document.createElement("div");
    const label = escapeHtml(formatKey(key));
    const text =
      key === "instruction" && instructionLimit
        ? truncate(String(value), instructionLimit)
        : formatValue(value);
    line.innerHTML = `<em>${label}:</em> ${escapeHtml(text)}`;
    container.appendChild(line);
  });
}

function renderPanel(item, titleEl, bodyEl) {
  titleEl.textContent = item.label || item.meta?.type || "Graph details";
  bodyEl.innerHTML = "";

  const meta = item.meta || {};
  const entries = Object.entries(meta).filter(([, value]) =>
    value !== null && value !== undefined && value !== ""
  );

  if (!entries.length) {
    bodyEl.textContent = "No metadata available.";
    return;
  }

  const list = document.createElement("div");
  list.className = "neo4j-graph__meta";

  entries.forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "neo4j-graph__row";

    const keyEl = document.createElement("div");
    keyEl.className = "neo4j-graph__key";
    keyEl.textContent = formatKey(key);

    const valueEl = document.createElement("div");
    valueEl.className = "neo4j-graph__value";
    valueEl.textContent = formatValue(value);

    row.appendChild(keyEl);
    row.appendChild(valueEl);
    list.appendChild(row);
  });

  bodyEl.appendChild(list);
}

function formatKey(key) {
  return key.replace(/_/g, " ");
}

function formatValue(value) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return JSON.stringify(value, null, 2);
}

function truncate(value, limit) {
  if (!value || value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit - 1)}...`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
