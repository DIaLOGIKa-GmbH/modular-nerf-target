import React, { MouseEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import dart from '../resources/dart.png';
import useWebSocket from "react-use-websocket";
import { CustomHex, findTileByPhysicalId } from "./targetGrid.tsx";
import data from '../database/highscores.json'


export default function Player() {
    const [ammo, setAmmo] = useState(-1);
    const [playerName, setPlayerName] = useState("");
    const [score, setScore] = useState(0);

    const socketUrl = 'ws://localhost:8765'; // Local WebSocket server
    const { lastMessage } = useWebSocket(socketUrl);
    const pathToHighscoreDatabase = '../database/highscores.json';

    useEffect(() => {
        if(lastMessage) {
            const lastMessageObject = JSON.parse(lastMessage?.data);
            if(lastMessageObject.action === "hit" && ammo != 0) {
              const hex : CustomHex | undefined = findTileByPhysicalId(lastMessageObject.physicalId)
              setScore(score => score + hex?.getPoints());
              setAmmo(ammo => ammo - 1);
            }
        }
    }, [lastMessage]);


    const PlayerLayout = styled.div`
        display: grid;
        grid-template-columns: auto auto auto;
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

    const handleNameInput = (event) => {
        setPlayerName(event.target.value);
    }

    const handleAmmoInput = (event) => {
        setAmmo(parseInt(event.target.value));
    }

    function MissHandler() {
        setAmmo(ammo => Math.max(0, ammo - 1));
    }

    useEffect(() => { 
        if (ammo === 0) {
            
        }
    }, [ammo])


    function Ammunition() {
        const ammunition = new Array(ammo).fill(null);
        return (
            <AmmunitionLayout>
                {ammunition.map((index) => (
                    <ScaledDart key={index} src={dart} alt={`${index}_dart`} />
                ))}
            </AmmunitionLayout>
        );
    }



    return (
        <>
            <PlayerLayout>
                {playerName === "" ? <input name="myInput" placeholder="Name" onBlur={handleNameInput}></input> : <div> {playerName} </div>}
                {ammo === -1 ? <input placeholder="Anzahl Schüsse" onBlur={handleAmmoInput}></input> : <Ammunition />}
                <button type="button" onClick={MissHandler}>Miss!</button>
                <div>{`Score: ${score}`}</div>
            </PlayerLayout>
        </>
    )
}