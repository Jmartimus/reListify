import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { runListMaker } from './listMaker';
import { type AuthorizedWebSocket, authenticateUser } from './authenticate';
import { configDotenv } from 'dotenv';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static('public'));

const port = 8080;

configDotenv();

wss.on('connection', (ws: AuthorizedWebSocket) => {
  ws.isAuthorized = false;
  ws.on('message', (message: string) => {
    if (!ws.isAuthorized) {
      authenticateUser(ws, message);
    } else {
      console.log('User is authorized!');
      runListMaker(ws)
        .then(() => {
          ws.send('List-making completed successfully.');
          console.log('reListify ran');
        })
        .catch((error) => {
          console.error('Error during list-making:', error);
          ws.send('Internal Server Error');
        });
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
