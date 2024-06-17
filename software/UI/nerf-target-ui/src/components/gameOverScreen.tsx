import React, { useEffect, useState } from "react"; 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFetch, usePut } from "./scoreBoard.tsx";




export default function GameOverScreen({playerName, playerScore, gameOverScreenCallback}) {
    
    const { data: highscores, isPending, error } = useFetch('http://localhost:3007/highscores')
    const [updateData, setUpdateData] = useState()

    useEffect(() => {
        if(highscores) {
            setUpdateData(highscores.push({id: 99, name: playerName, score: playerScore, date: ""}))
        }
    }, [highscores])
    
    return (
        <>
        <div>GAME OVER</div>
        <div>{`Tolle Leistung ${playerName}!`}</div>
        {error && <p>{error}</p>}
        {isPending && <p>Berechne Rang...</p>}
        {highscores && 
        <>
            <div> {`Du hast mit ${playerScore} Punkten den ${highscores.filter(score => score.score > playerScore).length + 1  }. Platz erreicht`}</div>
            <Button onClick={gameOverScreenCallback(updateData)} variant="primary" type="submit">
                Schließen
            </Button>
        </>
        }
    </>
    );
/*
return (
        <>
            <label>
                Name:
                <input
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                />
            </label>
            <label>
                Schüsse:
                <input
                    value={ammo}
                    onChange={e => setAmmo(e.target.value)}
                    type="number"
                />
            </label>
            <button onClick={() => startScreenCallback(playerName, ammoAsNumber)}>
                Spiel starten
            </button>
        </>
    );
    */   
}