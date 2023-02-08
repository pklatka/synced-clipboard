import { clipboard, nativeImage } from 'electron';
import { Socket } from 'socket.io-client';
import ConnectionManager from './connectionManager';
import { CLIPBOARD_CONTET_TYPE } from '../enums/clipboardContentType';
import { ClipboardContentData } from '../interfaces/clipboardContentData';

let clipboardInterval: string | number | NodeJS.Timer;

export async function saveContentToClipboard(data: ClipboardContentData): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            if (data.type == CLIPBOARD_CONTET_TYPE.IMAGE) {
                const content = data.content.replace(/^data:image\/png;base64,/, "");
                const image = nativeImage.createFromBuffer(Buffer.from(content, 'base64'));
                clipboard.writeImage(image);
                resolve('OK')
            } else if (data.type == CLIPBOARD_CONTET_TYPE.PLAIN_TEXT) {
                clipboard.writeText(data.content);
                resolve('OK')
            }

            reject("Invalid clipboard content type")
        } catch (error) {
            reject(error)
        }
    })

}

export async function getContentFromClipboard(socket: Socket): Promise<{ content: string, type: string }> {
    try {
        const image = clipboard.readImage()
        const imageBase64 = image.toPNG().toString('base64')
        const text = clipboard.readText()
        let clipboardContent = "", contentType = "";

        if (imageBase64) {
            socket.emit("set-clipboard-content", { content: imageBase64, type: "image" });
            clipboardContent = imageBase64;
            contentType = "image";
        } else if (text) {
            socket.emit("set-clipboard-content", { content: text, type: "plain-text" });
            clipboardContent = text;
            contentType = "plain-text";
        }

        return { content: clipboardContent, type: contentType }
    } catch (error) {
        console.error(error);
    }
}

export function startClipboardInterval(connection: ConnectionManager) {
    clipboardInterval = setInterval(async () => {
        connection.refresh();
        await getContentFromClipboard(connection.socket);
    }, 3000);
}

export function stopClipboardInterval() {
    clearInterval(clipboardInterval);
}