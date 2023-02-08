import { startClipboardInterval } from "./clipboardManager";
import ConnectionManager from "./connectionManager";

const createClientConnection = async () => {
    try {
        const connectionManager = new ConnectionManager();
        await connectionManager.create();

        startClipboardInterval(connectionManager);
        console.log(connectionManager.socket.connected)
    } catch (err) {
        console.log(err)
    }
}

createClientConnection()