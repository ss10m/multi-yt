// Libraries & utils
import express from "express";
import http from "http";
import path from "path";
import ioClient from "socket.io";

// Socket Handlers
import { roomHandlers, videoHandlers } from "./sockets/index.js";

// Initialize Server
const app = express();
const CLIENT_BUILD_PATH = path.join(path.resolve(), "../client/build");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(CLIENT_BUILD_PATH));
const server = http.Server(app);
const io = ioClient(server);
const PORT = 8080;
const HOST = "0.0.0.0";

app.get("*", (request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

io.on("connection", (socket) => {
    roomHandlers(io, socket);
    videoHandlers(io, socket);
});

server.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
