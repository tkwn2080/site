import React from 'react';

const Grid = ({ gridSize, gridState, handleGridClick, selectedLayerNodes, selectedDenseNodes }) => {
  const {
    connections,
    selectedPoint,
    inputNodes,
    outputNodes,
    hiddenNodes,
    definingLayer,
    definingDenseConnections,
    layers,
  } = gridState;

  const isPointSelected = (x, y) => selectedPoint && selectedPoint[0] === x && selectedPoint[1] === y;
  const isInputNode = (x, y) => inputNodes.some(node => node[0] === x && node[1] === y);
  const isOutputNode = (x, y) => outputNodes.some(node => node[0] === x && node[1] === y);
  const isHiddenNode = (x, y) => hiddenNodes.some(node => node[0] === x && node[1] === y);
  const isNodeInLayer = (x, y) => selectedLayerNodes && selectedLayerNodes.some(([nx, ny]) => nx === x && ny === y);
  const isNodeInDenseSelection = (x, y) => selectedDenseNodes && selectedDenseNodes.some(([nx, ny]) => nx === x && ny === y);
  const isNodeInDefinedLayer = (x, y) => layers && layers.some(layer => layer.nodes.some(([nx, ny]) => nx === x && ny === y));

  const gridItems = [];
  for (let y = Math.floor(gridSize / 2); y >= -Math.floor(gridSize / 2); y--) {
    for (let x = -Math.floor(gridSize / 2); x <= Math.floor(gridSize / 2); x++) {
      let backgroundClass = (x + y) % 2 === 0 ? 'bg-gray-50' : 'bg-white';
      
      if (isNodeInDefinedLayer(x, y)) {
        backgroundClass = 'bg-yellow-200';
      }
      
      if (definingLayer && isNodeInLayer(x, y)) {
        backgroundClass = 'bg-yellow-400';
      }
      
      if (definingDenseConnections && isNodeInDenseSelection(x, y)) {
        backgroundClass = 'bg-purple-400';
      }

      gridItems.push(
        <div
          key={`${x}-${y}`}
          className={`w-8 h-8 border flex items-center justify-center cursor-pointer
            ${backgroundClass}
            ${isPointSelected(x, y) ? 'border-4 border-blue-500' : 'border-gray-200'}
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
  );
};

export default Grid;