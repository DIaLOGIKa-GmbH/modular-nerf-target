import TargetGrid, { CustomHex } from "./components/targetGrid.tsx";
import ScoreBoard from "./components/scoreBoard.tsx";
import styled from "styled-components";
import React from "react";
import Player from "./components/player.tsx";

const BoardLayout = styled.div`
    display: grid;
    grid-template-areas: 'targetGrid player';
    height:fit-content;
`

export default function Board() {

    return (
        <BoardLayout>
            <TargetGrid />
            <Player/>
        </BoardLayout>
    )
}