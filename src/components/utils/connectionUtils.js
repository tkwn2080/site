export const createDenseConnections = (selectedDenseNodes, connections) => {
    if (selectedDenseNodes.length < 2) return connections;
  
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
  
    return [...connections, ...uniqueNewConnections];
  };