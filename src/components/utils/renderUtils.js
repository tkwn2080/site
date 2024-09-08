export const renderNodeList = (nodes, title, isConnection = false) => (
  <div className="mb-4">
    <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {nodes.map((node, index) => (
        <div key={index} className="bg-gray-100 p-1 rounded text-center text-sm">
          {isConnection 
            ? `(${node[0]},${node[1]}) to (${node[2]},${node[3]})`
            : `(${node[0]}, ${node[1]})`
          }
        </div>
      ))}
    </div>
  </div>
);

export const renderLayersList = (layers) => (
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