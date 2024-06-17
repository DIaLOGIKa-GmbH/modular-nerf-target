import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react';

interface UseFetchResult {
  data: any | null;
  isPending: boolean;
  error: any | null;
}

interface Score {
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

export const useFetch = (url: string): UseFetchResult => {
  const [data, setData] = useState<any | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
      setTimeout(() => {
          fetch(url)
              .then(res => {
                  if (!res.ok) {
                      throw Error('Error fetching users data');
                  }
                  return res.json();
              })
              .then(data => {
                  setData(data);
                  setIsPending(false);
                  setError(null);
              })
              .catch(err => {
                  setIsPending(false);
                  setError(err.message);
              });
      }, 1000);
  }, [url]);

  return { data, isPending, error };
}

export const usePut = (url: string, updateData: Score[]): UseFetchResult => {
  const [data, setData] = useState<any | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
      setTimeout(() => {
        fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        })
        .then(res => {
                  if (!res.ok) {
                      throw Error('Error fetching users data');
                  }
                  return res.json();
              })
              .then(data => {
                  setData(data);
                  setIsPending(false);
                  setError(null);
              })
              .catch(err => {
                  setIsPending(false);
                  setError(err.message);
              });
      }, 1000);
  }, [url]);

  return { data, isPending, error };
}


export default function ScoreBoard() {
  const { data: highscores, isPending, error } = useFetch('http://localhost:3007/highscores')

  return (
      <ScoreBoardLayout>
      <h1>Scoreboard</h1>
        {error && <p>{error}</p>}
        {isPending && <p>Loading Scoreboard...</p>}
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
