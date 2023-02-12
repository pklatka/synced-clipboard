import { SERVER } from '../enums/server'
import { Socket, io } from 'socket.io-client'
import { saveContentToClipboard } from './clipboardManager'
import { ClipboardContentData } from '../interfaces/clipboardContentData'

export default class ConnectionManager {
    url: string
    socket!: Socket

    constructor(ip: string) {
        this.url = `http://${ip}:${SERVER.PORT}`
    }

    async create(): Promise<string> {
        return new Promise((resolve, reject) => {
            const socket = io(this.url)

            socket.on('i-am-a-synced-clipboard-server', (isServer: boolean) => {
                if (!isServer) {
                    socket.disconnect()
                    reject('connect_error')
                } else {
                    this.socket = socket
                    socket.emit('client-connected')
                    resolve(this.url)
                }
            })

            socket.on('set-clipboard-content', (data: ClipboardContentData) => {
                saveContentToClipboard(data)
            })

            socket.on('connect_error', () => {
                socket.disconnect()
                reject('connect_error')
            })

            setTimeout(() => {
                socket.disconnect()
                reject('timeout')
            }, 30000)
        })
    }

    async refresh(): Promise<void> {
        if (!this.socket.connected) {
            this.create()
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