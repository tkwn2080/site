import { useState, useMemo, useEffect } from 'react';
import { createDenseConnections } from '../utils/connectionUtils';

export const useSubstrateDesigner = () => {
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [definingLayer, definingDenseConnections, nodeType]);

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

  const toggleDefiningLayer = () => {
    if (definingLayer) {
      if (selectedLayerNodes.length >= 2) {
        defineLayer();
      } else {
        setDefiningLayer(false);
        setSelectedLayerNodes([]);
      }
    } else {
      setDefiningLayer(true);
      setDefiningDenseConnections(false);
      setNodeType(null);
    }
  };

  const defineLayer = () => {
    if (selectedLayerNodes.length < 2) {
      alert("Please select at least 2 nodes to define a layer.");
      return;
    }

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

  const toggleDefiningDenseConnections = () => {
    if (definingDenseConnections && selectedDenseNodes.length >= 2) {
      const newConnections = createDenseConnections(selectedDenseNodes, connections);
      setConnections(newConnections);
      setSelectedDenseNodes([]);
    }
    setDefiningDenseConnections(!definingDenseConnections);
    setDefiningLayer(false);
    setNodeType(null);
  };

  const gridState = {
    connections,
    selectedPoint,
    nodeType,
    inputNodes,
    outputNodes,
    hiddenNodes,
    definingLayer,
    definingDenseConnections,
    selectedLayerNodes,
    selectedDenseNodes,
    layers,
  };

  return {
    gridState,
    handleGridClick,
    toggleNodeType,
    toggleDefiningLayer,
    toggleDefiningDenseConnections,
    isInstructionsOpen,
    setIsInstructionsOpen,
    selectedLayerNodes,
    selectedDenseNodes,
  };
};