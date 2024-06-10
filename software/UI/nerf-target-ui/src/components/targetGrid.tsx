import { defineHex, Grid, spiral, Orientation } from 'honeycomb-grid';
import { SVG } from '@svgdotjs/svg.js';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const TargetGridLayout = styled.div`
  grid-area: targetGrid;
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

export function findTileByPhysicalId(physicalId: number) {
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

export function findTileByVirtualId(physicalId: number) {
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

export default function TargetGrid() {
  const socketUrl = 'ws://localhost:8765'; // Local WebSocket server
  const [initEnabled, setInitEnabled] = useState(false);
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  useEffect(() => {
    if (lastMessage) {
      const lastMessageObject = JSON.parse(lastMessage?.data);
      if (lastMessageObject.action === 'init') {
        const hex: CustomHex | null = findTileByVirtualId(lastMessageObject.virtualId);
        hex?.setPhysicalId(lastMessageObject.physicalId);
      }
    }
  }, [lastMessage]);

  const scoreToColorMapping = new Map();
  scoreToColorMapping.set(100, new RGB(255,204,203));
  scoreToColorMapping.set(200, new RGB(144,238,144));
  scoreToColorMapping.set(300, new RGB(173,216,230));


  const toggleInitEnabled = useCallback(() => {
    setInitEnabled((prevInitEnabled) => !prevInitEnabled);
  }, []);

  const handleClick = useCallback(
    ({ offsetX, offsetY }) => {
      const hex = grid.pointToHex(
        { x: offsetX - grid.pixelWidth / 2, y: offsetY - grid.pixelHeight / 2 },
        { allowOutside: false }
      );
      console.log(hex, hex?.getColor().toString());
      if (readyState === ReadyState.OPEN && initEnabled) {
        sendJsonMessage({ action: 'init', virtualId: hex?.getVirtualId() });
      } else {
        console.log('No init message sent.', ReadyState.OPEN, readyState, initEnabled);
      }
    },
    [initEnabled, readyState, sendJsonMessage]
  );


  useEffect(() => {
    document.addEventListener('click', handleClick);
     // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick])

  
  useEffect(() => {
    const renderSVG = (hex: CustomHex) => {
      const polygon = draw
        .polygon(hex.corners.map(({ x, y }) => `${x + grid.pixelWidth / 2},${y + grid.pixelHeight / 2}`))
        .fill(hex.getColor().toString())
        .stroke({ width: 5, color: '#999' });


        // Calculate the center of the hexagon
        const centerX = hex.corners.reduce((sum, corner) => sum + corner.x, 0) / hex.corners.length;
        const centerY = hex.corners.reduce((sum, corner) => sum + corner.y, 0) / hex.corners.length;

      // Create the info element
      const text = draw.text("Score: " + hex.getScore().toString() + "\n PhysicalId: " + hex.getPhysicalId().toString() + "\n VirtualId: " + hex.getVirtualId().toString())
        .font({ size: 12, anchor: 'middle', fill: '#000' }) // Adjust font size and color as needed
        .move(centerX + grid.pixelWidth / 2 - 45, centerY + grid.pixelHeight / 2 - 30);

      // Center the text
      //text.attr({ 'text-anchor': 'middle', 'dominant-baseline': 'middle' });

      return draw.group().add(polygon).add(text);
    };


    // assign score points: Middle 300, 1 Ring 200, 2 Ring 100
    grid.forEach((hex) => {
      hex.setScore((3 - Math.max(Math.abs(hex.q), Math.abs(hex.r), Math.abs(hex.q + hex.r))) * 100);
      hex.setColor(scoreToColorMapping.get(hex.getScore()));
    });

    // assign virtual id
    grid.forEach((hex) => {
      hex.setVirtualId(Math.ceil(Math.random() * 99999));
    });

    // assign dummy physicalId for test
    grid.forEach((hex) => {
      hex.setPhysicalId(1);
    });

    //register tiles
    grid.forEach((hex) => registerTile(hex));

    // Render SVG elements when the component mounts
    grid.forEach(renderSVG);

    
  }, []); 

  return (
    <div>
      <div>
        <svg width={viewBoxWidth} height={viewBoxHeight} ref={(ref) => ref?.appendChild(draw.node)} />
      </div>
      <div>
        <input id="enableInit" type="checkbox" onChange={toggleInitEnabled} />
        <label htmlFor="enableInit">enableInitMode</label>
      </div>
      
    </div>
  );
}
