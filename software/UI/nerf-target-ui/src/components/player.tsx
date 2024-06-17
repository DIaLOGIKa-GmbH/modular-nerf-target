import React, { MouseEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import dart from '../resources/dart.png';
import useWebSocket from "react-use-websocket";
import { CustomHex, findTileByPhysicalId } from "./targetGrid.tsx";
import data from '../database/highscores.json'


export default function Player({initMode, playerName, ammunition, gameOverHandler}) {
    const [ammo, setAmmo] = useState(99);
    const [score, setScore] = useState(0);

    const socketUrl = 'ws://localhost:8765'; // Local WebSocket server
    const { lastMessage } = useWebSocket(socketUrl);

    useEffect(() => {
        setAmmo(ammunition);
      }, [ammunition]);

    useEffect(() => {
        if(!initMode && lastMessage) {
            const lastMessageObject = JSON.parse(lastMessage?.data);
            if(lastMessageObject.action === "hit" && ammo !== 0) {
              const hex : CustomHex | undefined = findTileByPhysicalId(lastMessageObject.physicalId)
              setScore(score => score + hex?.getPoints());
              setAmmo(ammo => ammo - 1);
              hex.setText("I'm hit!")
            }

        }
    }, [initMode, lastMessage]);


    const PlayerLayout = styled.div`
        display: grid;
        grid-template-columns: auto auto;
        width: max-content;
        justify-content: center;
        align-items: center;
        column-gap: 40px;
        font-size: x-large;
        height: fit-content;
    `
    // Define the dimensions of the scaled darts
    const scaledWidth = 5;
    const scaledHeight = 25;

    const AmmunitionLayout = styled.div`
        display: grid;
        grid-template-columns: repeat(${ammo}, minmax(${scaledWidth}px, 1fr));
        grid-gap: 10px;
        width: fit-content;
        `;

    const ScaledDart = styled.img`
        width: ${scaledWidth}px;
        height: ${scaledHeight}px;
    `;

    function MissHandler() {
        setAmmo(ammo => Math.max(0, ammo - 1));
    }

    useEffect(() => { 
        if (ammo === 0 && ammunition !== 0) {
            console.log("calling gameOverHandler", ammo, ammunition)
            gameOverHandler(score);
        }
    }, [ammo])


    function Ammunition() {
        console.log(ammunition, ammo)
        const ammunitionArray = new Array(ammo).fill(null);
        return (
            <AmmunitionLayout>
                {ammunitionArray.map((index) => (
                    <ScaledDart key={index} src={dart} alt={`${index}_dart`} />
                ))}
            </AmmunitionLayout>
            );
    }



    return (
        <>
            <PlayerLayout>
                {Ammunition()}
                <button type="button" onClick={MissHandler}>Miss!</button>
                <div>{playerName}</div>
                <div>{`Score: ${score}`}</div>
            </PlayerLayout>
        </>
    )
}