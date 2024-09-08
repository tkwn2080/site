import React from 'react';

const ControlPanel = ({
  toggleNodeType,
  toggleDefiningLayer,
  toggleDefiningDenseConnections,
  setIsInstructionsOpen,
  gridState
}) => {
  const { nodeType, definingLayer, definingDenseConnections } = gridState;

  return (
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
  );
};

export default ControlPanel;