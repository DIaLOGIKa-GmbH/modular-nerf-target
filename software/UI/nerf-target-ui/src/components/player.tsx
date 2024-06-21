import React, { MouseEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import dart from '../resources/dart.png';
import user from '../resources/user.svg';
import coin from '../resources/coin.svg';
import bullseye from '../resources/bullseye.svg';

import { CustomHex, findTileByPhysicalId, findTileByVirtualId } from "./targetGrid.tsx";
import Button from 'react-bootstrap/Button';
import myEmitter from './eventEmitter.ts'; 


export default function Player({initMode, playerName, ammunition, gameOverHandler, newGameTrigger}) {
    const [ammo, setAmmo] = useState(99);
    const [score, setScore] = useState(0);

    useEffect(() => {
        setAmmo(ammunition);
        setScore(0);
    }, [ammunition, newGameTrigger]);


    useEffect(() => {
        const handleTileHit = (physicalId) => {
            if (ammo !== 0) {
                const hex = findTileByPhysicalId(physicalId);
                console.log(hex);
                if (hex) {
                    setScore(score => score + hex.getScore());
                    setAmmo(ammo => ammo - 1);
                }
            }
        };

        myEmitter.on('tileHit', handleTileHit);

        return () => {
            myEmitter.off('tileHit', handleTileHit);
        };
    }, [ammo]);

    useEffect(() => {
        const handleTileHit = (virtualId) => {
            if (ammo !== 0) {
                const hex = findTileByVirtualId(virtualId);
                console.log(hex);
                if (hex) {
                    setScore(score => score + hex.getScore());
                    setAmmo(ammo => ammo - 1);
                }
            }
        };

        myEmitter.on('tileHitOnClick', handleTileHit);

        return () => {
            myEmitter.off('tileHitOnClick', handleTileHit);
        };
    }, [ammo]);

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