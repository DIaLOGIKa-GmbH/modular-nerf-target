import TargetGrid, { CustomHex } from "./components/targetGrid.tsx";
import ScoreBoard, { useFetch, usePut } from "./components/scoreBoard.tsx";
import styled from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import Player from "./components/player.tsx";
import StartScreen from "./components/startScreen.tsx";
import Modal from 'react-bootstrap/Modal';
import './board.css';
import GameOverScreen from "./components/gameOverScreen.tsx";
import WebSocketSender from "./components/webSocketSender.tsx";
import WebSocketListener from "./components/webSocketListener.tsx";
import myEmitter from "./components/eventEmitter.ts";
import './board.css';


const BoardLayout = styled.div`
    display: grid;
    grid-template-areas: 'targetGrid player'
                         'targetGrid scoreBoard';
    height:fit-content;
    width: fit-content;
    column-gap: 10rem;
    row-gap: 5rem;
`

  
export default function Board() {
    const [initMode, setInitMode] = useState(false);
    const toggleInitMode = useCallback(() => {
        setInitMode((prevInitMode) => !prevInitMode);
        }, []);

    const toggleScoreBoardReloadTrigger = useCallback(() => {
        setScoreBoardReloadTrigger((prev) => !prev);
    }, []);


    const [newGameTrigger, setNewGameTrigger] = useState(false);
    const toggleNewGameTrigger = useCallback(() => {
        setNewGameTrigger((prev) => !prev);
        }, []);

    
    const [startScreen, setStartScreen] = useState(true);
    const [playerName, setPlayerName] = useState("");
    const [ammunition, setAmmunition] = useState(0);
    const [gameOverScreen, setGameOverScreen] = useState(false);
    const [score, setScore] = useState(0);
    const [scoreBoardReloadTrigger, setScoreBoardReloadTrigger] = useState(false);


    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8765');
    
        ws.onopen = () => {
          console.log('WebSocket connected');
        };
    
        ws.onmessage = event => {
          const message = JSON.parse(event.data);
          console.log(`Received message from server: ${event.data}`);
    
          // Example: Handle message based on action
          if (message.action === 'hit') {
            console.log("handleHit")
            myEmitter.emit('tileHit', parseInt(message.physicalId));
          }
        };
    
        ws.onclose = () => {
          console.log('WebSocket disconnected');
        };
    
        return () => {
          ws.close();
        };
      }, []);


    function startScreenCallback (playerName: string, ammunition: number) {
        setStartScreen(false);
        console.log("info in startscreecallback", playerName, ammunition)
        setPlayerName(playerName);
        setAmmunition(ammunition);
        setScore(0);
        toggleNewGameTrigger();
    }

    function gameOverScreenCallback(updateData) {
        setGameOverScreen(false);
        toggleScoreBoardReloadTrigger();
        setStartScreen(true);
    }

    function gameOverHandler(score: number){
        console.log("gameOver!")
        setScore(score);
        setGameOverScreen(true);
        
        //Spielstand speichern
    }

    const modalContentStyle = {
        width: 'fit-content',
        maxWidth: '100%', // Adjust as needed
        margin: 'auto', // Center align if needed
      };

    return (
        <>
            <Modal show={startScreen} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Neue Runde</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StartScreen startScreenCallback = {startScreenCallback}/>
                </Modal.Body>
            </Modal>

            <Modal show={gameOverScreen} backdrop="static" >
                <Modal.Header closeButton>
                    <Modal.Title>GAME OVER</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <GameOverScreen gameOverScreenCallback = {gameOverScreenCallback} playerName={playerName} playerScore={score}/>
                </Modal.Body>
            </Modal>              
            
            <div>
                        <label htmlFor="enableInit">enableInitMode</label>
                        <input id="enableInit" type="checkbox" onChange={toggleInitMode} />
                    </div>
            <BoardLayout>   
                <TargetGrid initMode={initMode} />
                <Player initMode={initMode} playerName={playerName} ammunition={ammunition} gameOverHandler={gameOverHandler} newGameTrigger={newGameTrigger}/>
                <ScoreBoard reloadTrigger={scoreBoardReloadTrigger}/>
            </BoardLayout>
        </>
        )
}