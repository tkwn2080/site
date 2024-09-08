export const exportSubstrate = (gridState) => {
  const { inputNodes, hiddenNodes, outputNodes, connections, layers } = gridState;
  
  const substrate = {
    input_nodes: inputNodes.map(([x, y]) => ({ x, y })),
    hidden_nodes: hiddenNodes.map(([x, y]) => ({ x, y })),
    output_nodes: outputNodes.map(([x, y]) => ({ x, y })),
    connections: connections.map(([x1, y1, x2, y2]) => ({
      from: { x: x1, y: y1 },
      to: { x: x2, y: y2 }
    })),
    layers: layers.map((layer, index) => ({
      id: index,
      shape: layer.shape,
      nodes: layer.nodes.map(([x, y]) => ({ x, y }))
    }))
  };

  const jsonContent = JSON.stringify(substrate, null, 2);

  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hn-substrate.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};