import { Socket, io } from 'socket.io-client'
import { saveContentToClipboard } from './clipboardManager'
import { SERVER } from '../enums/server'
import { ClipboardContentData } from '../interfaces/clipboardContentData'
import { CONNECTION_STATUS } from '../enums/connectionStatus'

export default class ConnectionManager {
    url: string
    socket: Socket

    constructor() {
        this.url = `http://localhost:${SERVER.PORT}`
    }

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

    async refresh(): Promise<void> {
        try {
            if (!this.socket.connected) {
                await this.create()
            }
        } catch (error) {
            console.error("Refresh status: ", error)
        }
    }

    close(): boolean {
        if (this.socket) {
            this.socket.disconnect()
            return true
        }

        return false
    }

    createListener(event: string, callback: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.on(event, callback)
        }
    }

    removeListener(event: string, callback: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.off(event, callback)
        }
    }

    async emit(event: string, data: any): Promise<void> {
        await this.refresh()
        if (this.socket) {
            this.socket.emit(event, data)
        }
    }
}