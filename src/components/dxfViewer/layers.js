import React, { useRef, useEffect, useState } from 'react';
import DxfParser from 'dxf-parser';
import * as ThreeDxf from 'three-dxf';
import Layer from './layer';

function DxfLayerViewer({ file }) {
  const cadViewRef = useRef(null);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const loadDxfFile = async () => {
      try {
        const parser = new DxfParser();
        const dxf = parser.parseSync(file);
        const parsedLayers = extractLayers(dxf);
        setLayers(parsedLayers);
      } catch (error) {
        console.error('Error loading DXF file:', error);
      }
    };

    loadDxfFile();
  }, [file]);

  const extractLayers = (dxf) => {
    const extractedLayers = {};
    dxf.entities.forEach((entity) => {
      const layerName = entity.layer;
      if (!extractedLayers[layerName]) {
        extractedLayers[layerName] = [];
      }
      extractedLayers[layerName].push(entity);
    });

    return extractedLayers;
  };

  useEffect(() => {
    if (layers) {
      Object.keys(layers).forEach((layerName) => {
        const dxfData = layers[layerName];
        if (Array.isArray(dxfData) && dxfData.length > 0) {
          if (cadViewRef.current) {
            const dxf = {
              entities: dxfData,
            };
            const cadCanvas = new ThreeDxf.Viewer(dxf, cadViewRef.current, 200, 200);
            cadCanvas.render();
          } else {
            console.log('cadViewRef.current is not a valid DOM element.');
          }
        } else {
          console.log('Invalid dxfData for layer:', layerName);
        }
      });
    }
  }, [layers, cadViewRef]);

  return (
    <div >
      <div ref={cadViewRef} />
      {layers ? (
        <div>
          {Object.keys(layers).map((layerName, index) => (
            <Layer key={layerName} index={index} layerName={layerName} entities={layers[layerName]} />
          ))}
        </div>
      ) : (
        <p>Loading layers...</p>
      )}
    </div>
  );
}

export default DxfLayerViewer;
