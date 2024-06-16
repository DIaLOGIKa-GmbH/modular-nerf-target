import TargetGrid, { CustomHex } from "./components/targetGrid.tsx";
import ScoreBoard from "./components/scoreBoard.tsx";
import styled from "styled-components";
import React, { useCallback, useState } from "react";
import Player from "./components/player.tsx";

const BoardLayout = styled.div`
    display: grid;
    grid-template-areas: 'targetGrid player';
    height:fit-content;
`

  
export default function Board() {
    const [initMode, setInitMode] = useState(false);
    const toggleInitMode = useCallback(() => {
        setInitMode((prevInitMode) => !prevInitMode);
      }, []);

    return (

        <BoardLayout>
            <div>
                <div>
                    <label htmlFor="enableInit">enableInitMode</label>
                    <input id="enableInit" type="checkbox" onChange={toggleInitMode} />
                </div>
                <TargetGrid initMode={initMode} />
            </div>
            <Player initMode={initMode}/>
        </BoardLayout>
    )
}