import React from 'react';
import { useSubstrateDesigner } from './hooks/useSubstrateDesigner';
import { renderNodeList, renderLayersList } from './utils/renderUtils';
import { exportSubstrate } from './utils/exportUtils';
import Grid from './subcomponents/Grid';
import ControlPanel from './subcomponents/ControlPanel';
import InstructionsPopup from './subcomponents/InstructionsPopup';
import { GRID_SIZE } from './constants';

const SubstrateDesigner = () => {
  const {
    gridState,
    handleGridClick,
    toggleNodeType,
    toggleDefiningLayer,
    toggleDefiningDenseConnections,
    isInstructionsOpen,
    setIsInstructionsOpen,
    selectedLayerNodes,
    selectedDenseNodes,
  } = useSubstrateDesigner();

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">HyperNEAT Substrate Designer</h1>
      <ControlPanel
        toggleNodeType={toggleNodeType}
        toggleDefiningLayer={toggleDefiningLayer}
        toggleDefiningDenseConnections={toggleDefiningDenseConnections}
        setIsInstructionsOpen={setIsInstructionsOpen}
        gridState={gridState}
      />
      <Grid
        gridSize={GRID_SIZE}
        gridState={gridState}
        handleGridClick={handleGridClick}
        selectedLayerNodes={selectedLayerNodes}
        selectedDenseNodes={selectedDenseNodes}
      />
      <div className="w-full max-w-4xl">
        {renderNodeList(gridState.inputNodes, "Input Nodes")}
        {renderNodeList(gridState.hiddenNodes, "Hidden Nodes")}
        {renderNodeList(gridState.outputNodes, "Output Nodes")}
        {renderLayersList(gridState.layers)}
        {renderNodeList(gridState.connections, "Connections", true)}
      </div>
      <button
        onClick={() => exportSubstrate(gridState)}
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