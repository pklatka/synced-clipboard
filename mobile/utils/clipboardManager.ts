import * as Clipboard from 'expo-clipboard';
import { Socket } from 'socket.io-client';
import ConnectionManager from './connectionManager';

let lastClipboardContent: string = "";
let clipboardInterval: string | number | NodeJS.Timer | undefined;

export async function saveContentToClipboard(content: string, type: string): Promise<boolean> {
    try {
        if (type == Clipboard.ContentType.IMAGE) {
            content = content.replace(/^data:image\/png;base64,/, "");
            await Clipboard.setImageAsync(content);
            return true;
        } else if (type == Clipboard.ContentType.PLAIN_TEXT) {
            await Clipboard.setStringAsync(content);
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
}

export async function getContentFromClipboard(socket: Socket) {
    try {
        const hasImage = await Clipboard.hasImageAsync();
        const hasString = await Clipboard.hasStringAsync();
        let clipboardContent = "";
        let contentType = "";

        if (hasImage) {
            const image = await Clipboard.getImageAsync({ format: "png" })
            clipboardContent = image?.data == undefined ? "" : image.data;
            clipboardContent = clipboardContent.replace(/^data:image\/png;base64,/, "");
            contentType = Clipboard.ContentType.IMAGE;
            if (lastClipboardContent != clipboardContent) {
                socket.emit("set-clipboard-content", { content: clipboardContent, type: contentType });
            }
            lastClipboardContent = clipboardContent;
        } else if (hasString) {
            const string = await Clipboard.getStringAsync();
            clipboardContent = string;
            contentType = Clipboard.ContentType.PLAIN_TEXT;
            if (lastClipboardContent != clipboardContent) {
                socket.emit("set-clipboard-content", { content: clipboardContent, type: contentType });
            }
            lastClipboardContent = clipboardContent;
        }

        return { content: clipboardContent, type: contentType }
    } catch (error) {
        console.error(error);
    }
}

export function startClipboardInterval(connection: ConnectionManager) {
    clipboardInterval = setInterval(async () => {
        connection.refreshConnection();
        await getContentFromClipboard(connection.socket);
    }, 3000);
}

export function stopClipboardInterval() {
    clearInterval(clipboardInterval);
}