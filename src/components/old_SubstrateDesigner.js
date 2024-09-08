import React, { useState, useMemo, useEffect } from 'react';

const InstructionsPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="flex justify-center text-2xl font-bold mb-4">How to Use the HyperNEAT Substrate Designer</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li><strong>Place Input/Output Nodes:</strong> Click the respective buttons and then click on the grid to place nodes.</li>
          <li><strong>Create Individual Connections:</strong> Click sequentially on any two points on the grid to create a connection between them.</li>
          <li><strong>Remove Individual Connections:</strong> Click sequentially on any two points on the grid to remove a connection between them.</li>
          <li><strong>Create Dense Connections:</strong> 
            <ul className="list-disc list-inside ml-4">
              <li>Click "Create Dense Connections"</li>
              <li>Select nodes you want to connect densely (they will highlight in yellow)</li>
              <li>Click "Finish Dense Connections" to connect all selected nodes</li>
            </ul>
          </li>
          <li><strong>Define Layers:</strong>
            <ul className="list-disc list-inside ml-4">
              <li>Click "Define Layer"</li>
              <li>Select nodes you want in the layer (they will highlight in purple)</li>
              <li>Click "Finish Layer" to define the layer</li>
            </ul>
          </li>
          <li><strong>Export:</strong> Click "Export Substrate as JSON" to save your design.</li>
        </ol>
        <div className="flex justify-center mt-4">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SubstrateDesigner = () => {
  const gridSize = 25; // Fixed odd number for zero-centering
  const [connections, setConnections] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [nodeType, setNodeType] = useState(null);
  const [inputNodes, setInputNodes] = useState([]);
  const [outputNodes, setOutputNodes] = useState([]);

  const [definingLayer, setDefiningLayer] = useState(false);
  const [definingDenseConnections, setDefiningDenseConnections] = useState(false);
  const [selectedLayerNodes, setSelectedLayerNodes] = useState([]);
  const [selectedDenseNodes, setSelectedDenseNodes] = useState([]);
  const [layers, setLayers] = useState([]);

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const hiddenNodes = useMemo(() => {
    const allNodes = new Set([...inputNodes, ...outputNodes].map(node => JSON.stringify(node)));
    const hiddenSet = new Set();

    connections.forEach(([x1, y1, x2, y2]) => {
      const start = JSON.stringify([x1, y1]);
      const end = JSON.stringify([x2, y2]);
      if (!allNodes.has(start)) hiddenSet.add(start);
      if (!allNodes.has(end)) hiddenSet.add(end);
    });

    return Array.from(hiddenSet).map(node => JSON.parse(node));
  }, [connections, inputNodes, outputNodes]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (definingLayer) {
          setDefiningLayer(false);
          setSelectedLayerNodes([]);
        } else if (definingDenseConnections) {
          setDefiningDenseConnections(false);
          setSelectedDenseNodes([]);
        } else if (nodeType) {
          setNodeType(null);
        }
        setSelectedPoint(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [definingLayer, definingDenseConnections, nodeType]);

  const defineLayer = () => {
    if (selectedLayerNodes.length < 2) {
      alert("Please select at least 2 nodes to define a layer.");
      return;
    }

    // Sort nodes by y-coordinate (descending) and then by x-coordinate (ascending)
    const sortedNodes = [...selectedLayerNodes].sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0] - b[0];
    });

    const rows = [];
    let currentRow = [];
    let currentY = sortedNodes[0][1];

    sortedNodes.forEach(node => {
      if (node[1] !== currentY) {
        rows.push(currentRow);
        currentRow = [];
        currentY = node[1];
      }
      currentRow.push(node);
    });
    rows.push(currentRow);

    const layerShape = rows.map(row => row.length);
    
    const newLayer = {
      shape: layerShape,
      nodes: sortedNodes,
    };

    setLayers(prevLayers => [...prevLayers, newLayer]);
    setSelectedLayerNodes([]);
    setDefiningLayer(false);
  };

  const toggleDefiningLayer = () => {
    if (definingLayer) {
      if (selectedLayerNodes.length >= 2) {
        defineLayer();
      } else {
        // If no nodes are selected, just turn off the layer definition mode
        setDefiningLayer(false);
        setSelectedLayerNodes([]);
      }
    } else {
      setDefiningLayer(true);
      setDefiningDenseConnections(false);
      setNodeType(null);
    }
  };

  const toggleDefiningDenseConnections = () => {
    if (definingDenseConnections && selectedDenseNodes.length >= 2) {
      createDenseConnections();
    }
    setDefiningDenseConnections(!definingDenseConnections);
    setDefiningLayer(false);
    setNodeType(null);
  };

  const handleGridClick = (x, y) => {
    if (definingLayer) {
      const node = [x, y];
      setSelectedLayerNodes(prev => 
        prev.some(([px, py]) => px === x && py === y)
          ? prev.filter(([px, py]) => px !== x || py !== y)
          : [...prev, node]
      );
    } else if (definingDenseConnections) {
      const node = [x, y];
      setSelectedDenseNodes(prev => 
        prev.some(([px, py]) => px === x && py === y)
          ? prev.filter(([px, py]) => px !== x || py !== y)
          : [...prev, node]
      );
    } else if (nodeType) {
      handleNodePlacement(x, y);
    } else if (!selectedPoint) {
      setSelectedPoint([x, y]);
    } else {
      const [x1, y1] = selectedPoint;
      const [x2, y2] = [x, y];

      if (x1 === x2 && y1 === y2) {
        setSelectedPoint(null);
        return;
      }

      const newConnection = [x1, y1, x2, y2];

      const connectionIndex = connections.findIndex(
        conn => (conn[0] === x1 && conn[1] === y1 && conn[2] === x2 && conn[3] === y2) ||
                (conn[0] === x2 && conn[1] === y2 && conn[2] === x1 && conn[3] === y1)
      );

      if (connectionIndex !== -1) {
        setConnections(connections.filter((_, index) => index !== connectionIndex));
      } else {
        setConnections([...connections, newConnection]);
      }
      setSelectedPoint(null);
    }
  };

  const handleNodePlacement = (x, y) => {
    const newNode = [x, y];
    if (nodeType === 'input') {
      const index = inputNodes.findIndex(node => node[0] === x && node[1] === y);
      if (index !== -1) {
        setInputNodes(inputNodes.filter((_, i) => i !== index));
      } else {
        setInputNodes([...inputNodes, newNode]);
      }
    } else if (nodeType === 'output') {
      const index = outputNodes.findIndex(node => node[0] === x && node[1] === y);
      if (index !== -1) {
        setOutputNodes(outputNodes.filter((_, i) => i !== index));
      } else {
        setOutputNodes([...outputNodes, newNode]);
      }
    }
  };

  const toggleNodeType = (type) => {
    setNodeType(prevType => prevType === type ? null : type);
    setSelectedPoint(null);
    setDefiningLayer(false);
    setDefiningDenseConnections(false);
  };

  const createDenseConnections = () => {
    if (selectedDenseNodes.length < 2) return;

    const newConnections = [];

    selectedDenseNodes.sort((a, b) => a[1] - b[1]);

    for (let i = 0; i < selectedDenseNodes.length; i++) {
      const sourceNode = selectedDenseNodes[i];
      for (let j = i + 1; j < selectedDenseNodes.length; j++) {
        const targetNode = selectedDenseNodes[j];
        if (targetNode[1] > sourceNode[1]) {
          newConnections.push([...sourceNode, ...targetNode]);
        }
      }
    }

    const uniqueNewConnections = newConnections.filter(newConn => 
      !connections.some(existingConn => 
        (existingConn[0] === newConn[0] && existingConn[1] === newConn[1] && 
         existingConn[2] === newConn[2] && existingConn[3] === newConn[3]) ||
        (existingConn[0] === newConn[2] && existingConn[1] === newConn[3] && 
         existingConn[2] === newConn[0] && existingConn[3] === newConn[1])
      )
    );

    setConnections([...connections, ...uniqueNewConnections]);
    setSelectedDenseNodes([]);
    setDefiningDenseConnections(false);
  };

  const isPointSelected = (x, y) => {
    return selectedPoint && selectedPoint[0] === x && selectedPoint[1] === y;
  };

  const isInputNode = (x, y) => inputNodes.some(node => node[0] === x && node[1] === y);
  const isOutputNode = (x, y) => outputNodes.some(node => node[0] === x && node[1] === y);
  const isHiddenNode = (x, y) => hiddenNodes.some(node => node[0] === x && node[1] === y);
  const isNodeInLayer = (x, y) => {
    if (definingLayer) {
      return selectedLayerNodes.some(([nx, ny]) => nx === x && ny === y);
    }
    return layers.some(layer => layer.nodes.some(([nx, ny]) => nx === x && ny === y));
  };
  const isNodeInDenseSelection = (x, y) => {
    if (definingDenseConnections) {
      return selectedDenseNodes.some(([nx, ny]) => nx === x && ny === y);
    }
    return false;
  };

  const renderNodeList = (nodes, title) => (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {nodes.map(([x, y], index) => (
          <div key={index} className="bg-gray-100 p-1 rounded text-center text-sm">
            ({x}, {y})
          </div>
        ))}
      </div>
    </div>
  );

  const renderLayersList = () => (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-center">Defined Layers</h2>
      {layers.map((layer, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold">Layer {index + 1}</h3>
          <p>Shape: [{layer.shape.join(', ')}]</p>
          <div className="grid gap-2">
            {layer.shape.map((rowLength, rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {layer.nodes.slice(
                  layer.shape.slice(0, rowIndex).reduce((a, b) => a + b, 0),
                  layer.shape.slice(0, rowIndex + 1).reduce((a, b) => a + b, 0)
                ).map((node, colIndex) => (
                  <div key={`${rowIndex}-${colIndex}`} className="bg-gray-100 p-1 rounded text-center text-sm">
                    ({node[0]}, {node[1]})
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const exportSubstrate = () => {
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

  const gridItems = [];
  for (let y = Math.floor(gridSize / 2); y >= -Math.floor(gridSize / 2); y--) {
    for (let x = -Math.floor(gridSize / 2); x <= Math.floor(gridSize / 2); x++) {
      gridItems.push(
        <div
          key={`${x}-${y}`}
          className={`w-8 h-8 border flex items-center justify-center cursor-pointer
            ${(x + y) % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            ${isPointSelected(x, y) ? 'border-4 border-blue-500' : 'border-gray-200'}
            ${isNodeInLayer(x, y) ? 'bg-purple-200' : ''}
            ${isNodeInDenseSelection(x, y) ? 'bg-yellow-200' : ''}
            ${definingLayer && selectedLayerNodes.some(([nx, ny]) => nx === x && ny === y) ? 'bg-purple-400' : ''}
            relative`}
          onClick={() => handleGridClick(x, y)}
        >
          {isInputNode(x, y) && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          )}
          {isOutputNode(x, y) && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          )}
          {isHiddenNode(x, y) && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          )}
          {x === -Math.floor(gridSize / 2) && <div className="absolute left-0 text-xs text-gray-500">{y}</div>}
          {y === -Math.floor(gridSize / 2) && <div className="absolute bottom-0 text-xs text-gray-500">{x}</div>}
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">HyperNEAT Substrate Designer</h1>
      <div className="mb-4 flex items-center">
        <button
          onClick={() => toggleNodeType('input')}
          className={`px-4 py-2 rounded mr-2 ${
            nodeType === 'input'
              ? 'bg-green-500 text-white border-2 border-blue-500'
              : 'bg-green-500 text-white'
          }`}
        >
          Place/Remove Input Nodes
        </button>
        <button
          onClick={() => toggleNodeType('output')}
          className={`px-4 py-2 rounded mr-2 ${
            nodeType === 'output'
              ? 'bg-red-500 text-white border-2 border-blue-500'
              : 'bg-red-500 text-white'
          }`}
        >
          Place/Remove Output Nodes
        </button>
        <button
          onClick={toggleDefiningDenseConnections}
          className={`px-4 py-2 rounded mr-2 ${
            definingDenseConnections
              ? 'bg-purple-500 text-white border-2 border-blue-500'
              : 'bg-purple-500 text-white'
          }`}
        >
          {definingDenseConnections ? 'Finish Dense Connections' : 'Create Dense Connections'}
        </button>
        <button
          onClick={toggleDefiningLayer}
          className={`px-4 py-2 rounded mr-2 ${
            definingLayer
              ? 'bg-yellow-500 text-white border-2 border-blue-500'
              : 'bg-yellow-500 text-white'
          }`}
        >
          {definingLayer ? 'Finish Layer' : 'Define Layer'}
        </button>
        <button
          onClick={() => setIsInstructionsOpen(true)}
          className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center ml-2"
        >
          ?
        </button>
      </div>
      <div 
        className="grid mb-4 relative" 
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 2rem)`,
          gridTemplateRows: `repeat(${gridSize}, 2rem)`
        }}
      >
        {gridItems}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {connections.map(([x1, y1, x2, y2], index) => (
            <g key={index}>
              <line
                x1={(x1 + Math.floor(gridSize / 2) + 0.5) * 32}
                y1={(Math.floor(gridSize / 2) - y1 + 0.5) * 32}
                x2={(x2 + Math.floor(gridSize / 2) + 0.5) * 32}
                y2={(Math.floor(gridSize / 2) - y2 + 0.5) * 32}
                stroke="black"
                strokeWidth="2"
              />
              <circle
                cx={(x1 + Math.floor(gridSize / 2) + 0.5) * 32}
                cy={(Math.floor(gridSize / 2) - y1 + 0.5) * 32}
                r="4"
                fill="black"
              />
              <circle
                cx={(x2 + Math.floor(gridSize / 2) + 0.5) * 32}
                cy={(Math.floor(gridSize / 2) - y2 + 0.5) * 32}
                r="4"
                fill="black"
              />
            </g>
          ))}
        </svg>
      </div>
      <div className="w-full max-w-4xl">
        {renderNodeList(inputNodes, "Input Nodes")}
        {renderNodeList(hiddenNodes, "Hidden Nodes")}
        {renderNodeList(outputNodes, "Output Nodes")}
        {renderLayersList()}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-center">Connections</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {connections.map(([x1, y1, x2, y2], index) => (
              <div key={index} className="bg-gray-100 p-1 rounded text-center text-sm">
                ({x1},{y1}) to ({x2},{y2})
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={exportSubstrate}
        className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
      >
        Export Substrate as JSON
      </button>
      <InstructionsPopup 
        isOpen={isInstructionsOpen} 
        onClose={() => setIsInstructionsOpen(false)} 
      />
    </div>
  );
};

export default SubstrateDesigner;