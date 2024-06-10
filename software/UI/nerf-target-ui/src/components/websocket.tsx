/*
import React, { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';


const WebSocketComponent = () => {
    const socketUrl = 'ws://localhost:8765'; // Local WebSocket server

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    

    function handleHit(physicalId: number) {
        console.log("physicalId", physicalId);
        hitTileCallback(physicalId);
    }

    useEffect(() => {
        if(lastMessage) {
            const lastMessageObject = JSON.parse(lastMessage?.data);
            switch(lastMessageObject.action) {
                case "init": {
                    handleInitResponse(lastMessageObject.virtualId, lastMessageObject.physicalId);
                    break;
                }
                case "hit": {
                    handleHit(lastMessageObject.physicalId);
                    break;
                }
                default: {
                    console.log("unknown action", lastMessageObject.action)
                }
            }
        }
    }, [lastMessage]);

    const handleClickSendMessage = () => {
        sendInitRequest(11);

    };

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div>
            <button onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
                Send Test Message
            </button>
            <p>The WebSocket is currently: {connectionStatus}</p>
            {lastMessage ? <p>Last message: {lastMessage.data}</p> : null}
        </div>
    );
};

export default WebSocketComponent;

*/