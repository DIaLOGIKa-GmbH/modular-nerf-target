import React, { MouseEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import dart from '../resources/dart.png';
import user from '../resources/user.svg';
import coin from '../resources/coin.svg';
import bullseye from '../resources/bullseye.svg';

import useWebSocket from "react-use-websocket";
import { CustomHex, findTileByPhysicalId } from "./targetGrid.tsx";
import data from '../database/highscores.json'
import Button from 'react-bootstrap/Button';


export default function Player({initMode, playerName, ammunition, gameOverHandler, newGameTrigger}) {
    const [ammo, setAmmo] = useState(99);
    const [score, setScore] = useState(0);

    const socketUrl = 'ws://localhost:8765'; // Local WebSocket server
    const { lastMessage } = useWebSocket(socketUrl);

    useEffect(() => {
        setAmmo(ammunition);
      }, [ammunition, newGameTrigger]);

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
        row-gap: 1rem;
        font-size: x-large;
        height: fit-content;
    `
    // Define the dimensions of the scaled darts
    const scaledWidthDart = 10;
    const scaledHeightDart = 50;

    // Define the dimensions of the scaled icons
    const scaledWidthIcon = 40;
    const scaledHeightIcon = 40;

    const AmmunitionLayout = styled.div`
        display: grid;
        grid-template-columns: repeat(${ammo}, minmax(${scaledWidthDart}px, 1fr));
        grid-gap: 10px;
        width: fit-content;
        `;

    const ScaledDart = styled.img`
        width: ${scaledWidthDart}px;
        height: ${scaledHeightDart}px;
    `;

    const ScaledIcon = styled.img`
        width: ${scaledWidthIcon}px;
        height: ${scaledHeightIcon}px;
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
                <ScaledIcon src={bullseye}/> <div> {Ammunition()}</div>
                
                <ScaledIcon src={user} key={"playerNameIcon"}/> <div> {playerName}</div>
                <ScaledIcon src={coin} key={"scoreIcon"}/> <div> {score}</div>

                <Button variant="dark" type="button" onClick={MissHandler}>Miss!</Button>
            </PlayerLayout>
        </>
    )
}