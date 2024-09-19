// server.js
const { EcgData, EEGData } = require("./sampleData.js");
const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let i = 0,
  j = 0;
// Simulate ECG data
const generateECGData = () => {
  const d = EcgData[i];
  i = i > EcgData.length ? 0 : i + 1;

  return d;
};

const generateEEGData = () => {
  const d = EEGData[i];
  j = j > EEGData.length ? 0 : j + 1;

  return d;
};

wss.on("connection", (ws) => {
  console.log("Client connected");

  const sendECGData = setInterval(() => {
    ws.send(JSON.stringify({ ECG: generateECGData(), EEG: generateEEGData() }));
  }, 80); // Send data every 50ms

  ws.on("close", () => {
    clearInterval(sendECGData);
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
