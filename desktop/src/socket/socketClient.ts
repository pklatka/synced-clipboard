import { startClipboardInterval } from "../utils/clipboardManager";
import ConnectionManager from "../utils/connectionManager";

/**
 * Creates client connection.
 */
const createClientConnection = async () => {
    try {
        const connectionManager = new ConnectionManager();
        await connectionManager.create();

        startClipboardInterval(connectionManager);
    } catch (err) {
        throw new Error(err);
    }
}

// Initialize client connection.
do {
    try {
        createClientConnection();
        break;
    } catch (error) {
        console.error(error);
    }
} while (true)
