import * as Clipboard from 'expo-clipboard';
import { Socket } from 'socket.io-client';
import ConnectionManager from './connectionManager';
import { ClipboardContentData } from '../interfaces/clipboardContentData';
import { CLIPBOARD_CONTET_TYPE } from '../enums/clipboardContentType';

let clipboardInterval: string | number | NodeJS.Timer | undefined;
let previousClipboardContent: string = "";

export async function saveContentToClipboard(data: ClipboardContentData): Promise<boolean> {
    try {
        if (data.type == CLIPBOARD_CONTET_TYPE.IMAGE) {
            const content = data.content.replace(/^data:image\/png;base64,/, "");
            await Clipboard.setImageAsync(content);
            return true;
        } else if (data.type == CLIPBOARD_CONTET_TYPE.PLAIN_TEXT) {
            await Clipboard.setStringAsync(data.content);
            return true;
        }

        return false;
    } catch (error) {
        console.error(error)
        return false;
    }
}

export async function getContentFromClipboard(socket: Socket, executedByUser: boolean = false): Promise<ClipboardContentData> {
    try {
        const hasImage: boolean = await Clipboard.hasImageAsync();
        const hasString: boolean = await Clipboard.hasStringAsync();
        let clipboardContent: string = "";
        let contentType: CLIPBOARD_CONTET_TYPE = CLIPBOARD_CONTET_TYPE.UNDEFINED;

        if (hasImage) {
            const image = await Clipboard.getImageAsync({ format: "png" })
            clipboardContent = image?.data == undefined ? "" : image.data;
            clipboardContent = clipboardContent.replace(/^data:image\/png;base64,/, "");
            contentType = CLIPBOARD_CONTET_TYPE.IMAGE;
            // TODO: Fix code below
            // Image in base64 format from Clipboard.getImageAsync is not always the same as in previousClipboardContent variable. That's why synchronization (react-native app) -> (server) for images is right now disabled.
            if (executedByUser) {
                socket.emit("set-clipboard-content", { content: clipboardContent, type: contentType });
                previousClipboardContent = clipboardContent;
            }
        } else if (hasString) {
            const str = await Clipboard.getStringAsync();
            clipboardContent = str;
            contentType = CLIPBOARD_CONTET_TYPE.PLAIN_TEXT;
            if (clipboardContent != previousClipboardContent) {
                socket.emit("set-clipboard-content", { content: clipboardContent, type: contentType });
                previousClipboardContent = clipboardContent;
            }
        }

        return { content: clipboardContent, type: contentType }
    } catch (error) {
        console.error(error);
        return { content: "", type: CLIPBOARD_CONTET_TYPE.UNDEFINED }
    }
}

export function startClipboardInterval(connection: ConnectionManager): void {
    clipboardInterval = setInterval(async () => {
        connection.refresh();
        await getContentFromClipboard(connection.socket);
    }, 10000);
}

export function stopClipboardInterval(): void {
    clearInterval(clipboardInterval);
}