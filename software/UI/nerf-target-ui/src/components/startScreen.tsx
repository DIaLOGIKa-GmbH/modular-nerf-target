import React, { useState } from "react"; 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


export default function StartScreen({startScreenCallback}) {
    const [playerName, setPlayerName] = useState('');
    const [ammo, setAmmo] = useState(5);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission behavior
        startScreenCallback(playerName, ammo);
    };

    return (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="playerName">
            <Form.Label>Name</Form.Label>
            <Form.Control required type="string" placeholder="Name" value={playerName} onChange={(e) => setPlayerName(e.target.value)}/>
          </Form.Group>
    
          <Form.Group className="mb-3" controlId="ammunition">
            <Form.Label>Anzahl Schüsse</Form.Label>
            <Form.Control required type="number" placeholder="0" value={ammo} onChange={(e) => setAmmo(Number(e.target.value))}/>
          </Form.Group>
          <Button variant="dark" type="submit">
            Spiel starten
          </Button>
        </Form>
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