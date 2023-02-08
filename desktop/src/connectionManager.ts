import { Socket, io } from 'socket.io-client'
import { saveContentToClipboard } from './clipboardManager'

interface ClipboardContentData {
    content: string
    type: string
}

export default class ConnectionManager {
    url: string
    socket: Socket

    constructor() {
        this.url = 'http://localhost:21370'
    }

    async create() {
        return new Promise((resolve, reject) => {
            const socket = io(this.url)

            socket.on('i-am-a-synced-clipboard-server', (isServer: boolean) => {
                if (!isServer) {
                    socket.disconnect()
                    reject('connect_error')
                } else {
                    this.socket = socket
                    resolve(this.url)
                }
            })

            socket.on('set-clipboard-content', (data: ClipboardContentData) => {
                console.log("Setting clipboard content")
                saveContentToClipboard(data.content, data.type)
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

    async refreshConnection() {
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

    createListener(event: string, callback: (...args: any[]) => void) {
        if (this.socket) {
            this.socket.on(event, callback)
        }
    }

    removeListener(event: string, callback: (...args: any[]) => void) {
        if (this.socket) {
            this.socket.off(event, callback)
        }
    }

    async emit(event: string, data: any) {
        await this.refreshConnection()
        if (this.socket) {
            this.socket.emit(event, data)
        }
    }
}