import React, { useState, useMemo } from 'react';

const SubstrateDesigner = () => {
  const gridSize = 25; // Fixed odd number for zero-centering
  const [connections, setConnections] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [nodeType, setNodeType] = useState(null); // 'input', 'output', 'dense', or null
  const [inputNodes, setInputNodes] = useState([]);
  const [outputNodes, setOutputNodes] = useState([]);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);

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

  const handleGridClick = (x, y) => {
    if (nodeType === 'dense') {
      if (!selectionStart) {
        setSelectionStart([x, y]);
      } else {
        setSelectionEnd([x, y]);
        createDenseConnections();
      }
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
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const createDenseConnections = () => {
    if (!selectionStart || !selectionEnd) return;

    const [x1, y1] = selectionStart;
    const [x2, y2] = selectionEnd;
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    const nodesInArea = {
      input: inputNodes.filter(([x, y]) => x >= minX && x <= maxX && y >= minY && y <= maxY),
      hidden: hiddenNodes.filter(([x, y]) => x >= minX && x <= maxX && y >= minY && y <= maxY),
      output: outputNodes.filter(([x, y]) => x >= minX && x <= maxX && y >= minY && y <= maxY),
    };

    const allNodes = [...nodesInArea.input, ...nodesInArea.hidden, ...nodesInArea.output];
    allNodes.sort((a, b) => a[1] - b[1]); // Sort nodes by y-coordinate

    const newConnections = [];

    // Function to determine if a node is an output node
    const isOutputNode = (node) => nodesInArea.output.some(([x, y]) => x === node[0] && y === node[1]);

    // Create connections between layers
    for (let i = 0; i < allNodes.length; i++) {
      const sourceNode = allNodes[i];
      if (!isOutputNode(sourceNode)) { // Don't create connections from output nodes
        for (let j = i + 1; j < allNodes.length; j++) {
          const targetNode = allNodes[j];
          if (targetNode[1] > sourceNode[1]) { // Ensure the target node is in a later row
            newConnections.push([...sourceNode, ...targetNode]);
          }
        }
      }
    }

    // Filter out existing connections
    const uniqueNewConnections = newConnections.filter(newConn => 
      !connections.some(existingConn => 
        (existingConn[0] === newConn[0] && existingConn[1] === newConn[1] && 
         existingConn[2] === newConn[2] && existingConn[3] === newConn[3]) ||
        (existingConn[0] === newConn[2] && existingConn[1] === newConn[3] && 
         existingConn[2] === newConn[0] && existingConn[3] === newConn[1])
      )
    );

    setConnections([...connections, ...uniqueNewConnections]);
    setSelectionStart(null);
    setSelectionEnd(null);
    setNodeType(null);
  };

  const isPointSelected = (x, y) => {
    return selectedPoint && selectedPoint[0] === x && selectedPoint[1] === y;
  };

  const isPointInSelection = (x, y) => {
    if (!selectionStart || !selectionEnd) return false;
    const [x1, y1] = selectionStart;
    const [x2, y2] = selectionEnd;
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  };

  const isInputNode = (x, y) => inputNodes.some(node => node[0] === x && node[1] === y);
  const isOutputNode = (x, y) => outputNodes.some(node => node[0] === x && node[1] === y);
  const isHiddenNode = (x, y) => hiddenNodes.some(node => node[0] === x && node[1] === y);

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

  const exportSubstrate = () => {
    const substrate = {
      input_nodes: inputNodes.map(([x, y]) => `(${x}, ${y})`),
      hidden_nodes: hiddenNodes.map(([x, y]) => `(${x}, ${y})`),
      output_nodes: outputNodes.map(([x, y]) => `(${x}, ${y})`),
      connections: connections.map(([x1, y1, x2, y2]) => `((${x1},${y1}), (${x2},${y2}))`)
    };
  
    const fileContent = Object.entries(substrate)
      .map(([key, value]) => `${key.replace('_', ' ')}:\n${value.join('\n')}`)
      .join('\n\n');
  
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hn-substrate.txt';
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
            ${isPointInSelection(x, y) ? 'bg-yellow-200' : ''}
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
      <div className="mb-4">
        <button
          onClick={() => toggleNodeType('input')}
          className={`px-4 py-2 rounded mr-2 ${
            nodeType === 'input'
              ? 'bg-green-500 text-white border-2 border-blue-500'
              : 'bg-green-500 text-white'
          }`}
        >
          Place/Remove Input Node
        </button>
        <button
          onClick={() => toggleNodeType('output')}
          className={`px-4 py-2 rounded mr-2 ${
            nodeType === 'output'
              ? 'bg-red-500 text-white border-2 border-blue-500'
              : 'bg-red-500 text-white'
          }`}
        >
          Place/Remove Output Node
        </button>
        <button
          onClick={() => toggleNodeType('dense')}
          className={`px-4 py-2 rounded mr-2 ${
            nodeType === 'dense'
              ? 'bg-purple-500 text-white border-2 border-blue-500'
              : 'bg-purple-500 text-white'
          }`}
        >
          Create Dense Connections
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
        Export Substrate
      </button>
    </div>
  );
};

export default SubstrateDesigner;