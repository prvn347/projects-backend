import express from "express";
import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
const server = app.listen(3000);

const wss = new WebSocketServer({ server: server });
wss.on(
  "connection",
  function connection(ws: WebSocket, request: any, client: any) {
    ws.on;
  }
);
