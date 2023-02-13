import { CLIPBOARD_CONTET_TYPE } from "../enums/clipboardContentType"

/**
 * Object that contains clipboard content and type of content.
 */
export type ClipboardContentData = {
    content: string
    type: CLIPBOARD_CONTET_TYPE
}