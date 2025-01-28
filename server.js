/* eslint-disable no-undef */
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

const server = createServer(app); //create http server and pass this express server

const io = new Server(server); //instance of Server class (from socket.io)

io.on('connection', (socket) => {
    console.log("Socket connected: "+socket.id);
    
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
    
})