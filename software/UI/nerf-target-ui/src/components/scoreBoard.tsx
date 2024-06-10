import React from 'react'
import data from '../database/highscores.json'
import styled from 'styled-components'

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

export default function ScoreBoard() {
  const sortedData = data.sort((a, b) => b.score - a.score)
  
  return (
      <ScoreBoardLayout>
      <h1>Scoreboard</h1>
        {
          sortedData.map((data, i) => (
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
