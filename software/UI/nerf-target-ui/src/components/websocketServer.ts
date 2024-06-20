// websocketServer.js or websocketServer.ts
 
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8765 });

wss.on('connection', ws => {
  console.log('Client connected');

  // Function to send messages periodically
  const sendPeriodicMessage = () => {
    const message = JSON.stringify({
      action: 'hit',
      physicalId: '99'
    });
    ws.send(message); // Send message to the client
  };

  // Schedule sending messages every 5 seconds
  const intervalId = setInterval(sendPeriodicMessage, 1000); // 5000 milliseconds = 5 seconds

  ws.on('message', message => {
    console.log(`Received message: ${message}`);
    // Handle incoming messages from clients if needed
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(intervalId); // Stop sending messages when client disconnects
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server is running on ws://localhost:8765');