import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react';
import { UseFetchResult, useFetch } from './databaseConnector.tsx';



export interface Score {
  id: number;
  name: string;
  score: number;
  date: string;
}

interface Highscores{
  scores: Score[];
}

const ScoreBoardLayout = styled.div`
  grid-area: scoreBoard;
  width: max-content;
  height: fit-content;
  display: grid;
`
const ScoreBoardEntry = styled.div`
grid-template-areas:
'name score';
grid-template-columns: 80% 20%;
display: grid;
`

const NameEntry = styled.div`
  display:grid;
  grid-area: name;
  margin: unset;
  padding: unset;
`

const ScoreEntry = styled.div`
  display:grid;
  grid-area: score;
  margin: unset;
  padding: unset;
`


export default function ScoreBoard({reloadTrigger}) {
  const {fetchData, data: highscores, loading, error } = useFetch()
  
  useEffect(() => {
    fetchData('http://localhost:3007/highscores')
  }, [reloadTrigger])
  
  return (
      <ScoreBoardLayout>
      <h1>Scoreboard</h1>
        {error && <p>{error}</p>}
        {loading && <p>Loading Scoreboard...</p>}
        {highscores && highscores.sort((a,b,) => b.score - a.score).map((data, i) => (
            <ScoreBoardEntry>
              <NameEntry >
                {data.name}
              </NameEntry>
              <ScoreEntry>
                {data.score}
              </ScoreEntry>
            </ScoreBoardEntry>
            ))
        }
      </ScoreBoardLayout>
    )
}
