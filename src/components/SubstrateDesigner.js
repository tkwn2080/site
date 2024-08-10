import React, { useState } from 'react';

const SubstrateDesigner = () => {
  const [gridSize, setGridSize] = useState(8);
  const [connections, setConnections] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const handleGridClick = (x, y) => {
    if (!selectedPoint) {
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
        // Remove the connection if it already exists
        setConnections(connections.filter((_, index) => index !== connectionIndex));
      } else {
        // Add the new connection
        setConnections([...connections, newConnection]);
      }
      setSelectedPoint(null);
    }
  };

  const isPointSelected = (x, y) => {
    return selectedPoint && selectedPoint[0] === x && selectedPoint[1] === y;
  };

  const gridItems = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      gridItems.push(
        <div
          key={`${x}-${y}`}
          className={`w-8 h-8 border flex items-center justify-center cursor-pointer
            ${(x + y) % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            ${isPointSelected(x, y) ? 'border-4 border-blue-500' : 'border-gray-200'}`}
          onClick={() => handleGridClick(x, y)}
        >
          {x === 0 && <div className="absolute left-0 text-xs text-gray-500">{y}</div>}
          {y === gridSize - 1 && <div className="absolute bottom-0 text-xs text-gray-500">{x}</div>}
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">HyperNEAT Substrate Designer</h1>
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">Grid Size:</label>
        <select
          id="gridSize"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          className="border rounded p-1"
        >
          {[8, 16, 24, 32].map(size => (
            <option key={size} value={size}>{size}x{size}</option>
          ))}
        </select>
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
              x1={(x1 + 0.5) * 32}
              y1={(y1 + 0.5) * 32}
              x2={(x2 + 0.5) * 32}
              y2={(y2 + 0.5) * 32}
              stroke="red"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
      <div className="w-full max-w-md">
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