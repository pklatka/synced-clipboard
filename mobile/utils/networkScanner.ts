import NetInfo from "@react-native-community/netinfo";
import ip from "react-native-ip-subnet"
import { io } from "socket.io-client";


export class NetworkScanner {
    ipAddress: string = [0, 0, 0, 0];
    subnet: string = [255, 255, 255, 0];
    firstAddress: Array<number> = [0, 0, 0, 0];
    lastAddress: Array<number> = [0, 0, 0, 0];

    constructor() {
        this.init()
    }

    async init() {
        const status = await NetInfo.fetch();
        this.ipAddress = status.details.ipAddress
        this.subnet = "255.255.255.255" == status.details.subnet ? "255.255.255.0" : status.details.subnet

        const subnetDetails = ip.subnet(this.ipAddress, this.subnet)
        this.firstAddress = subnetDetails.firstAddress.split(".").map((x: string) => parseInt(x))
        this.lastAddress = subnetDetails.lastAddress.split(".").map((x: string) => parseInt(x))

        this.scan()
    }

    async checkIp(ip: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const socket = io(`http://${ip}:3000`)
            socket.on("connect", () => {
                socket.disconnect()
                console.log("WITAM")
                console.log(ip)
                resolve(true)
            })
            socket.on("connect_error", () => {
                socket.disconnect()
                reject(false)
            })

            setTimeout(() => {
                socket.disconnect()
                reject(false)
            }, 30000)
        })
    }

    async scan() {
        console.log("Scanning network...")

        let currentAddress: Array<number> = this.firstAddress.slice()

        let promises = []
        while (JSON.stringify(currentAddress) !== JSON.stringify(this.lastAddress)) {

            promises.push(this.checkIp(currentAddress.join(".")))

            currentAddress[3] += 1

            if (currentAddress[3] >= 255) {
                currentAddress[3] = 0
                currentAddress[2] += 1
            }

            if (currentAddress[2] >= 255) {
                currentAddress[2] = 0
                currentAddress[1] += 1
            }

            if (currentAddress[1] >= 255) {
                currentAddress[1] = 0
                currentAddress[0] += 1
            }
        }

        const result = await Promise.allSettled(promises)
        result.forEach(x => {
            if (x.status === "fulfilled" && x.value) {
                console.log("Found server")
            }
        })

        console.log("ende")
    }
}