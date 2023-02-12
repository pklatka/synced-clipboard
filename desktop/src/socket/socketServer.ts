import { createServer } from 'http';
import { Server } from "socket.io";
import { SERVER } from "../enums/server";

const httpServer = createServer();
const io = new Server(httpServer, {
    maxHttpBufferSize: 1e8 // 100 MB
});

let data = { content: "", type: "" }
const clientList: Set<string> = new Set()

export const getClientList = () => {
    return Array.from(clientList);
}

io.on('connection', socket => {
    console.log("Client has connected")
    const clientIp = socket.conn.remoteAddress.replace('::ffff:', '')

    socket.emit('client-authorization', true);

    socket.on('client-connected', () => {
        if (clientIp !== '::1' && clientIp !== '') {
            clientList.add(clientIp)
        }
    })

    socket.on('set-clipboard-content', ({ content, type }) => {
        // Emit to all sockets
        if (JSON.stringify(data) === JSON.stringify({ content, type })) {
            return;
        }

        data = { content, type };
        socket.broadcast.emit('set-clipboard-content', { content, type });
    })

    socket.on('get-clipboard-content', () => {
        socket.emit('set-clipboard-content', data);
    })

    socket.on('disconnect', function () {
        console.log("Client has disconnected")
        clientList.delete(clientIp)
    });
});

httpServer.listen(SERVER.PORT, () => {
    console.log(`Listening on port ${SERVER.PORT}!`);
});
