import React, { useState } from 'react';

const SubstrateDesigner = () => {
  const gridSize = 15; // Fixed odd number for zero-centering
  const [connections, setConnections] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [nodeType, setNodeType] = useState(null); // 'input', 'output', or null
  const [inputNodes, setInputNodes] = useState([]);
  const [outputNodes, setOutputNodes] = useState([]);

  const handleGridClick = (x, y) => {
    if (nodeType) {
      handleNodePlacement(x, y);
    } else if (!selectedPoint) {
      setSelectedPoint([x, y]);
    } else {
      const [x1, y1] = selectedPoint;
      const [x2, y2] = [x, y];
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
      setInputNodes([...inputNodes, newNode]);
    } else if (nodeType === 'output') {
      setOutputNodes([...outputNodes, newNode]);
    }
    setNodeType(null);
  };

  const isPointSelected = (x, y) => {
    return selectedPoint && selectedPoint[0] === x && selectedPoint[1] === y;
  };

  const isInputNode = (x, y) => inputNodes.some(node => node[0] === x && node[1] === y);
  const isOutputNode = (x, y) => outputNodes.some(node => node[0] === x && node[1] === y);

  const gridItems = [];
  for (let y = Math.floor(gridSize / 2); y >= -Math.floor(gridSize / 2); y--) {
    for (let x = -Math.floor(gridSize / 2); x <= Math.floor(gridSize / 2); x++) {
      gridItems.push(
        <div
          key={`${x}-${y}`}
          className={`w-8 h-8 border flex items-center justify-center cursor-pointer
            ${(x + y) % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            ${isPointSelected(x, y) ? 'border-4 border-blue-500' : 'border-gray-200'}
            ${isInputNode(x, y) ? 'bg-green-300' : ''}
            ${isOutputNode(x, y) ? 'bg-red-300' : ''}`}
          onClick={() => handleGridClick(x, y)}
        >
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
          onClick={() => setNodeType('input')}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Place Input Node
        </button>
        <button
          onClick={() => setNodeType('output')}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Place Output Node
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
        <svg className="absolute pointer-events-none" style={{width: `${gridSize * 2}rem`, height: `${gridSize * 2}rem`}}>
          {connections.map(([x1, y1, x2, y2], index) => (
            <line
              key={index}
              x1={(x1 + Math.floor(gridSize / 2) + 0.5) * 32}
              y1={(Math.floor(gridSize / 2) - y1 + 0.5) * 32}
              x2={(x2 + Math.floor(gridSize / 2) + 0.5) * 32}
              y2={(Math.floor(gridSize / 2) - y2 + 0.5) * 32}
              stroke="red"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Input Nodes:</h2>
        <ul className="list-disc pl-5 mb-4">
          {inputNodes.map(([x, y], index) => (
            <li key={index}>({x}, {y})</li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mb-2">Output Nodes:</h2>
        <ul className="list-disc pl-5 mb-4">
          {outputNodes.map(([x, y], index) => (
            <li key={index}>({x}, {y})</li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mb-2">Connections:</h2>
        <ul className="list-disc pl-5">
          {connections.map(([x1, y1, x2, y2], index) => (
            <li key={index}>
              ({x1}, {y1}) to ({x2}, {y2})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubstrateDesigner;