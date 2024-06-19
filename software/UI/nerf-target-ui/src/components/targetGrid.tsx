import { defineHex, Grid, spiral, Orientation } from 'honeycomb-grid';
import { SVG } from '@svgdotjs/svg.js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import '../board.css'
import { useFetch, usePost } from './databaseConnector.tsx';

const TargetGridLayout = styled.div`
  grid-area: targetGrid;
  align-content: center;
`;

class RGB {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  toString() {
    return `rgba(${this.r},${this.g},${this.b},1.0)`;
  }
}

class CustomHex extends defineHex({ dimensions: 60, orientation: Orientation.FLAT }) {
  score: number;
  color: RGB;
  virtualId: number;
  physicalId: number;
  text: string;

  setScore(score: number) {
    this.score = score;
  }

  getScore() {
    return this.score;
  }

  setColor(color: RGB) {
    this.color = color;
  }
  getColor() {
    return this.color;
  }

  setVirtualId(id: number) {
    this.virtualId = id;
  }
  getVirtualId() {
    return this.virtualId;
  }

  setPhysicalId(id: number) {
    this.physicalId = id;
  }
  getPhysicalId() {
    return this.physicalId;
  }
}

const tiles: CustomHex[] = [];
const grid = new Grid(CustomHex, spiral({ radius: 2 }));
const draw = SVG().size(`${grid.pixelWidth}`, `${grid.pixelHeight}`);
const viewBoxWidth = grid.pixelWidth;
const viewBoxHeight = grid.pixelHeight;

function registerTile(newTile: CustomHex) {
  const virtualIdExists = tiles.some((tile) => tile.getVirtualId() === newTile.getVirtualId());
  if (!virtualIdExists) {
    tiles.push(newTile);
  }
}

export function findTileByPhysicalId(physicalId: number) : CustomHex | null {
  let matchingTile: CustomHex | null = null;
  tiles.forEach((tile) => {
    if (tile.getPhysicalId() === physicalId) {
      matchingTile = tile;
    }
  });
  if (!matchingTile) {
    console.log('Tile not found! PhysicalId: ', physicalId);
  }
  return matchingTile;
}

export function findTileByVirtualId(physicalId: number) : CustomHex | null {
  let hex: CustomHex | null = null;
  tiles.forEach((tile) => {
    if (tile.getVirtualId() === physicalId) {
      hex = tile;
    }
  });
  if (!hex) {
    console.log('Tile not found! VirtualId: ', physicalId);
  }
  return hex;
}


export default function TargetGrid({ initMode }) {

  const { postData, loading: putLoading, error: putError } = usePost();
  const { fetchData, data: idMapping, loading: fetchLoading, error: fetchError } = useFetch();


  const initModeRef = useRef(initMode)
  const [renderTrigger, setRenderTrigger] = useState(false);
  const toggleRenderTrigger = useCallback(() => {
      setRenderTrigger((prevRenderTrigger) => !prevRenderTrigger);
    }, []);

    const [updateColorTrigger, setUpdateColorTrigger] = useState(false);
    const toggleUpdateColorTrigger = useCallback(() => {
      setUpdateColorTrigger((prev) => !prev);
      }, []);


  const socketUrl = 'ws://localhost:8765'; // Local WebSocket server
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const scoreToColorMapping = new Map();
  scoreToColorMapping.set(100, new RGB(255,204,203));
  scoreToColorMapping.set(200, new RGB(144,238,144));
  scoreToColorMapping.set(300, new RGB(173,216,230));




  const handleClick = ({ offsetX, offsetY }) => {

      const hex = grid.pointToHex(
        { x: offsetX - grid.pixelWidth / 2, y: offsetY - grid.pixelHeight / 2 },
        { allowOutside: false }
      );
      
      if (initModeRef.current && lastMessage && hex) {
        const lastMessageObject = JSON.parse(lastMessage?.data);
        hex.setPhysicalId(lastMessageObject.physicalId);
        postData('http://localhost:3007/idMapping', {virtualId: hex.virtualId, physicalId: hex.physicalId})
        updateColor();
        toggleRenderTrigger();
      }

      /*if (readyState === ReadyState.OPEN && initEnabled) {
        sendJsonMessage({ action: 'init', virtualId: hex?.getVirtualId() });
      } else {
        console.log('No init message sent.', ReadyState.OPEN, readyState, initEnabled);
      }*/
    }


  function updateColor() {
    tiles.forEach((tile) => {
      if(initMode) {
        console.log("change color", tile.getPhysicalId())
        tile.getPhysicalId() ? tile.setColor(new RGB(181,229,80)) : tile.setColor(new RGB(255,165,0))
      } else {
        tile.setColor(scoreToColorMapping.get(tile.getScore()));
      }
    })
  }
  useEffect(() => {
    // load physical id from database
    console.log("idMapping", idMapping);
    idMapping?.forEach((mapEntry) => {
      findTileByVirtualId(mapEntry.virtualId)?.setPhysicalId(mapEntry.physicalId)
  })
    updateColor();
    toggleRenderTrigger();
  }, [idMapping])


  useEffect(() => {
    updateColor();    
    //update the ref for the clickHandler
    initModeRef.current = initMode;
    //trigger render udpate
    toggleRenderTrigger();
  }, [initMode])

  useEffect(() => {
    fetchData('http://localhost:3007/idMapping')
  }, [])

  useEffect(() => {
    document.addEventListener('click', handleClick);

    // assign virtual id
    // grid overwrites the forEach implementation. Index is not available
    let hexIndex = 0;
    grid.forEach((hex) => {
      hex.setVirtualId(hexIndex);
      hexIndex++;
    }); 
    
    //register tiles
    grid.forEach((hex) => registerTile(hex));
    
    // assign score points: Middle 300, 1 Ring 200, 2 Ring 100
    grid.forEach((hex) => {
      hex.setScore((3 - Math.max(Math.abs(hex.q), Math.abs(hex.r), Math.abs(hex.q + hex.r))) * 100);
      hex.setColor(scoreToColorMapping.get(hex.getScore()));
    });

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [/*perform once*/])

  useEffect(() => {
    draw.clear();

    const renderSVG = (hex: CustomHex) => {
      

      // Calculate the center of the hexagon
      const centerX = hex.corners.reduce((sum, corner) => sum + corner.x, 0) / hex.corners.length  + grid.pixelWidth / 2;
      const centerY = hex.corners.reduce((sum, corner) => sum + corner.y, 0) / hex.corners.length + grid.pixelHeight / 2;

              
      const polygon = draw
        .polygon(hex.corners.map(({ x, y }) => `${x + grid.pixelWidth / 2},${y + grid.pixelHeight / 2}`))
        .fill(hex.getColor().toString())
        .stroke({ width: 5, color: '#999' });


        // Create the info element
      let text;
      
      let infoText : string;
      if(initMode) {
        infoText = hex.getScore().toString() + "\n PhysicalId: " + hex.getPhysicalId()?.toString() + "\n VirtualId: " + hex.getVirtualId().toString()
        text = draw.text(infoText)
          .font({ size: 12, anchor: 'middle', fill: '#000' }) // Adjust font size and color as needed
          .cx(centerX)
          .cy(centerY)
      } else {
        infoText =hex.getScore().toString(); 
        text = draw.text(infoText)
          .font({ size: 18, weight: 'bold', anchor: 'middle', fill: '#000' }) // Adjust font size and color as needed
          .cx(centerX)
          .cy(centerY)
      }

      return draw.group().add(polygon).add(text);
    };

    // assign dummy physicalId for test
    //grid.forEach((hex) => {
    //  hex.setPhysicalId(1);
    //});

    // Render SVG elements when the component mounts
    grid.forEach(renderSVG);

    
  }, [renderTrigger]); 

  return (
    <TargetGridLayout>
      <svg width={viewBoxWidth} height={viewBoxHeight} ref={(ref) => ref?.appendChild(draw.node)} />
    </TargetGridLayout>
  );
}
