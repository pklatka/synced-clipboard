import { SERVER } from '../constants/server'
import { io } from 'socket.io-client'

export default class ConnectionManager {
    url: string
    socket: any = null

    constructor(ip: string) {
        this.url = `http://${ip}:${SERVER.PORT}`
    }

    async createConnection() {
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

    disconnect(): boolean {
        if (this.socket) {
            this.socket.disconnect()
            return true
        }

        return false
    }

    createListener(event: string, callback: Function) {
        if (this.socket) {
            this.socket.on(event, callback)
        }
    }

    removeListener(event: string, callback: Function) {
        if (this.socket) {
            this.socket.off(event, callback)
        }
    }

    emit(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data)
        }
    }
}