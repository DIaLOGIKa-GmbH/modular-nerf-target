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
  min-width: 20rem;
  height: fit-content;
  display: grid;
`
const ScoreBoardEntry = styled.div`
grid-template-areas:
'name score';
grid-template-columns: 80% 20%;
display: grid;
`

const FirstPlace = styled.div`
  display:grid;
  grid-area: name;
  margin: unset;
  padding: unset;
  color: green;
  font-size: 1.5rem;
  font-weight: bold;
`

const SecondPlace = styled.div`
  display:grid;
  grid-area: name;
  margin: unset;
  padding: unset;
  color: green;
  font-size: 1.3rem;
  font-weight: bold;
`

const ThirdPlace = styled.div`
  display:grid;
  grid-area: name;
  margin: unset;
  padding: unset;
  color: green;
  font-size: 1.1rem;
  font-weight: bold;
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
  justify-content: center;
  align-content: center;
`


export default function ScoreBoard({reloadTrigger}) {
  const {fetchData, data: highscores, loading, error } = useFetch()
  const maxNumberItems = 10;

  useEffect(() => {
    fetchData('http://localhost:3007/highscores')
  }, [reloadTrigger])
  
  return (
      <ScoreBoardLayout>
      <h2>Scoreboard</h2>
        {error && <p>{error}</p>}
        {loading && <p>Loading Scoreboard...</p>}
        {highscores && highscores.sort((a, b) =>
          {
            // First compare the scores
            //if (b.score !== a.score) {
              return b.score - a.score;
            //}
            // If scores are equal, compare the dates
            //const aDate = new Date(a.date);
            //const bDate = new Date(b.date);
            //if(aDate && bDate) {
            //  return bDate - aDate;
            //}
          }).map((data, i) => (
            <ScoreBoardEntry>
              {i === 0 &&
                <FirstPlace >
                  {`${i+1}. ${data.name}`}
                </FirstPlace>
              }
              {i === 1 &&
                <SecondPlace >
                  {`${i+1}. ${data.name}`}
                </SecondPlace>
              }
              {i === 2 &&
                <ThirdPlace >
                  {`${i+1}. ${data.name}`}
                </ThirdPlace>
              }
              {i > 2 && i < maxNumberItems &&
                <NameEntry >
                  {`${i+1}. ${data.name}`}
                </NameEntry>
              } 
              { i < maxNumberItems &&
                <ScoreEntry>
                  {data.score}
                </ScoreEntry>
              }
            </ScoreBoardEntry>
            ))
        }
      </ScoreBoardLayout>
    )
}
