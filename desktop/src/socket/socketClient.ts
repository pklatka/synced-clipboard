import { startClipboardInterval } from "../utils/clipboardManager";
import ConnectionManager from "../utils/connectionManager";

const createClientConnection = async () => {
    try {
        const connectionManager = new ConnectionManager();
        await connectionManager.create();

        startClipboardInterval(connectionManager);
    } catch (err) {
        throw new Error(err);
    }
}

createClientConnection()