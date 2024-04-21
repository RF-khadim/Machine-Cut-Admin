import React, { useRef, useEffect } from 'react';
import DxfParser from 'dxf-parser';
import * as ThreeDxf from 'three-dxf';

function DXFViewer({ file }) {
  const cadViewRef = useRef(null);
  const cadCanvasRef = useRef(null);

  useEffect(() => {
    const loadDxfFile = async () => {
      try {
        const parser = new DxfParser();
        const dxf = parser.parseSync(file);
        const cadCanvas = new ThreeDxf.Viewer(dxf, cadViewRef.current, 100, 100);
        cadCanvasRef.current = cadCanvas;
        
        // Hide the second canvas element
        const cadViewDiv = cadViewRef.current;
        if (cadViewDiv) {
          const canvasElements = cadViewDiv.getElementsByTagName('canvas');
          if (canvasElements.length >= 2) {
            canvasElements[1].style.display = 'none';
          }
        }
      } catch (error) {
        console.error('Error loading DXF file:', error);
      }
    };

    loadDxfFile();
  }, [file]);

  return <div id="cad-view" ref={cadViewRef} />;
}

export default DXFViewer;
