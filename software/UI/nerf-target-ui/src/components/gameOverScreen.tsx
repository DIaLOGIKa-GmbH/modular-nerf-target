import React, { useEffect, useState } from "react"; 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFetch, usePost } from "./databaseConnector.tsx";
import styled from "styled-components";



const GameOverLayout = styled.div`
    display: grid;
    grid-template-columns: auto;
    width: max-content;
    justify-content: center;
    align-items: center;
    column-gap: 40px;
    row-gap: 1rem;
    font-size: x-large;
    height: fit-content;
`

export default function GameOverScreen({playerName, playerScore, gameOverScreenCallback}) {
    
    const {fetchData, data: highscores, loading, error } = useFetch()
    const [updateData, setUpdateData] = useState(null)
    const [rank, setRank] = useState()
    const { postData, loading: putLoading, error: putError } = usePost();

    useEffect(() => {
        fetchData('http://localhost:3007/highscores')
    }, [])

    useEffect(() => {
        if(highscores) {
            setRank(highscores.filter(score => score.score >= playerScore).length + 1  )
        }
    }, [highscores, playerName, playerScore])

    const handleClose = () => {
        const id = 99;
        const newHighscore = {id: id, name: playerName, score: playerScore, date: new Date().toDateString()};
        postData(`http://localhost:3007/highscores`, newHighscore)
        gameOverScreenCallback();
    }

    return (
        <GameOverLayout>
        {false && <div>{`Tolle Leistung ${playerName}!`}</div>}
        {error && <p>{error}</p>}
        {loading && <p>Berechne Rang...</p>}
        {highscores && 
        <>
            <div> {`Du hast mit ${playerScore} Punkten den ${rank}. Platz erreicht`}</div>
            <Button variant="dark" onClick={handleClose} type="submit">
                Schließen
            </Button>
        </>
        }
    </GameOverLayout>
    );   
}