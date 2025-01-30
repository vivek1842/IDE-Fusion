/* eslint-disable no-undef */
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Actions from './src/Actions.js';


const app = express();

const server = createServer(app); //create http server and pass this express server

const io = new Server(server); //instance of Server class (from socket.io)

const userSocketMap = {}; //w're mapping and storing users in memory, after every restart, it'll be deleted (to avoid that we can save in mongodb or redis memory storage)
let i =0;

const getAllConnectedClients = (roomId) => {
    // io.sockets.adapter.rooms.get() will give result in maps (this will give all rooms created in our sockets)
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map( (socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId], //in socketId we're receiving rooms name i.e. roomId when we created room
        };
    });
    console.log(`Clients in room ${roomId}:`, clients);
    return clients;
}

io.on('connection', (socket) => {
    console.log("Socket connected: "+socket.id);
    
    console.log("count"+i++);
    

    socket.on(Actions.JOIN, ({ roomId, username }) => {
         // Ensure the user isn't already in the room
        // if (Object.values(userSocketMap).includes(username)) {
        //     socket.emit(Actions.ERROR, { message: "You are already in the room" });
        //     return;
        // }

        userSocketMap[socket.id] = username;
        socket.join(roomId); //rooms create in our socket
        const clients =  getAllConnectedClients(roomId);
        console.log(clients);

         // Emit to other clients in the room, excluding the joining user
        clients.forEach(({ socketId }) => {
            if (socketId !== socket.id) { // Don't send the event to the joining user
                io.to(socketId).emit(Actions.JOINED, {
                    clients,
                    username,
                    socketId: socket.id,
                }
            )};
        });
    })

    // Handle disconnections
    socket.on('disconnecting', () => { //should not be'disconnect' as it will remove all rooms available
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(Actions.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id];
        socket.leave(); //leave the room
    });

    
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
    
})