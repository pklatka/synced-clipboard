import { clipboard, nativeImage } from 'electron';
import { Socket } from 'socket.io-client';
import ConnectionManager from './connectionManager';
import { CLIPBOARD_CONTET_TYPE } from '../enums/clipboardContentType';
import { ClipboardContentData } from '../types/clipboardContentData';

let clipboardInterval: string | number | NodeJS.Timer;

/**
 * Saves content to clipboard.
 * 
 * @param data Clipboard content data.
 * @returns Promise<boolean> Returns true if content is saved to clipboard.
 */
export async function saveContentToClipboard(data: ClipboardContentData): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            if (data.type == CLIPBOARD_CONTET_TYPE.IMAGE) {
                const content = data.content.replace(/^data:image\/png;base64,/, "");
                const image = nativeImage.createFromBuffer(Buffer.from(content, 'base64'));
                clipboard.writeImage(image);
                resolve(true)
            } else if (data.type == CLIPBOARD_CONTET_TYPE.PLAIN_TEXT) {
                clipboard.writeText(data.content);
                resolve(true)
            }

            console.error("Clipboard content type is not supported.")
            reject(false)
        } catch (error) {
            reject(false)
        }
    })

}

/**
 * Gets content from clipboard.
 * 
 * @param socket Socket connection.
 * @returns Promise<ClipboardContentData> Returns clipboard content data.
 */
export async function getContentFromClipboard(socket: Socket): Promise<ClipboardContentData> {
    try {
        const image = clipboard.readImage()
        const imageBase64 = image.toPNG().toString('base64')
        const text = clipboard.readText()
        let clipboardContent = "", contentType = CLIPBOARD_CONTET_TYPE.UNDEFINED;

        if (imageBase64) {
            clipboardContent = imageBase64;
            contentType = CLIPBOARD_CONTET_TYPE.IMAGE;
            socket.emit("set-clipboard-content", { content: clipboardContent, type: contentType });
        } else if (text) {
            clipboardContent = text;
            contentType = CLIPBOARD_CONTET_TYPE.PLAIN_TEXT;
            socket.emit("set-clipboard-content", { content: clipboardContent, type: contentType });
        }

        return { content: clipboardContent, type: contentType }
    } catch (error) {
        console.error(error);
    }
}

/**
 * Starts clipboard interval.
 * 
 * @param connection Connection manager.
 */
export function startClipboardInterval(connection: ConnectionManager): void {
    clipboardInterval = setInterval(async () => {
        connection.refresh();
        await getContentFromClipboard(connection.socket);
    }, 3000);
}

/**
 * Stops clipboard interval.
 */
export function stopClipboardInterval(): void {
    clearInterval(clipboardInterval);
}