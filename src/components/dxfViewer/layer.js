import React, { useEffect, useRef } from 'react';
import DxfParser from 'dxf-parser';
import * as ThreeDxf from 'three-dxf';

function Layer({ layers,index }) {
  const canvasRefs = useRef({});

  useEffect(() => {
    if (layers) {
      Object.entries(layers).forEach(([layerName, layer]) => {
        const { dxfData } = layer;
        const canvasRef = canvasRefs.current[layerName];
        if (canvasRef && canvasRef.current && Array.isArray(dxfData)) {
          const parser = new DxfParser();
          const parsedEntities = dxfData.map(entity => parser.parseEntity(entity));
          const dxf = {
            entities: parsedEntities,
          };
          if (parsedEntities?.length > 0) {
            const cadCanvas = new ThreeDxf.Viewer(dxf, canvasRef.current, 200, 200);
            cadCanvas.render();
          } else {
            console.log("Invalid dxfData for layer:", layerName);
          }
        } else {
          console.log("Invalid dxfData for layer:", layerName);
        }
      });
    }
  }, [layers]);

  return (
    <div>
      {layers &&
        Object.entries(layers).map(([layerName],index) => (
          <div key={layerName} >
            <h3>Layers:{index}</h3>
            <div  ref={ref => (canvasRefs.current[layerName] = ref)} />
          </div>
        ))}
    </div>
  );
}

export default Layer;
