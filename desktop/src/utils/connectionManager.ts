import { Socket, io } from 'socket.io-client'
import { saveContentToClipboard } from './clipboardManager'
import { SERVER } from '../enums/server'
import { ClipboardContentData } from '../types/clipboardContentData'
import { CONNECTION_STATUS } from '../enums/connectionStatus'

/**
 * Class that manages connection to server.
 */
export default class ConnectionManager {
    url: string
    socket: Socket

    /**
     * Constructor for connection manager instance.
     * 
     * @param ip Server IP address.
     * @returns Connection manager.
     */
    constructor() {
        this.url = `http://localhost:${SERVER.PORT}`
    }

    /**
     * Creates connection to server.
     */
    async create(): Promise<string> {
        return new Promise((resolve, reject) => {
            const socket = io(this.url)

            socket.on('client-authorization', (isServer: boolean) => {
                if (!isServer) {
                    socket.disconnect()
                    reject(CONNECTION_STATUS.ERROR)
                } else {
                    this.socket = socket
                    resolve(this.url)
                }
            })

            socket.on('set-clipboard-content', async (data: ClipboardContentData) => {
                saveContentToClipboard(data)
            })

            socket.on('connect_error', () => {
                socket.disconnect()
                reject(CONNECTION_STATUS.ERROR)
            })

            setTimeout(() => {
                socket.disconnect()
                reject(CONNECTION_STATUS.TIMEOUT)
            }, 30000)
        })
    }

    /**
     * Refreshes connection to server.
     */
    async refresh(): Promise<void> {
        try {
            if (!this.socket.connected) {
                await this.create()
            }
        } catch (error) {
            console.error("Refresh status: ", error)
        }
    }


    /**
     * Closes connection to server.
     */
    close(): boolean {
        if (this.socket) {
            this.socket.disconnect()
            return true
        }

        return false
    }

    /**
     * Adds listener to socket.
     */
    createListener(event: string, callback: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.on(event, callback)
        }
    }

    /**
     * Removes listener from socket.
     */
    removeListener(event: string, callback: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.off(event, callback)
        }
    }

    /**
     * Emits event to socket.
     */
    async emit(event: string, data: any): Promise<void> {
        await this.refresh()
        if (this.socket) {
            this.socket.emit(event, data)
        }
    }
}