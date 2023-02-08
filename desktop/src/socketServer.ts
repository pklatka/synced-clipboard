import { createServer } from 'http';
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    maxHttpBufferSize: 1e8 // 100 MB
});

const PORT = 21370;
let data = { content: "", type: "" }

io.on('connection', socket => {
    socket.emit('i-am-a-synced-clipboard-server', true);

    socket.on('set-clipboard-content', ({ content, type }) => {
        // Emit to all sockets
        if (JSON.stringify(data) === JSON.stringify({ content, type })) {
            return
        }

        data = { content, type };
        console.log(data)
        io.emit('set-clipboard-content', { content, type });
    })

    socket.on('get-clipboard-content', () => {
        console.log(data)
        socket.emit('set-clipboard-content', data);
    })

    socket.on('disconnect', function () {
        console.log("Client has disconnected")
    });
});

httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});
