import React from 'react';

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

export default InstructionsPopup;