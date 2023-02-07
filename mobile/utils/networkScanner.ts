import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import ip from "react-native-ip-subnet"
import { io } from "socket.io-client";
import { SERVER } from "../constants/server";


/**
 * Function to check if there is a server on given ip address
 * 
 * @param ip {string} ip address to check
 * @param setState {function} function to set state
 * @returns {Promise<boolean>} true if server is found, false otherwise
 * 
 */
async function checkIp(ip: string, setState: (callback: any) => void): Promise<string> {
    return new Promise((resolve, reject) => {
        const serverUrl = `http://${ip}:${SERVER.PORT}`
        const socket = io(serverUrl)

        socket.on("i-am-a-synced-clipboard-server", (isServer: boolean) => {
            if (!isServer) {
                socket.disconnect()
                reject("connect_error")
            } else {
                socket.disconnect()
                setState((prevState: Array<string>) => {
                    if (prevState.includes(ip)) return prevState
                    return [...prevState, ip]
                })
                resolve(ip)
            }
        })

        socket.on("connect_error", () => {
            socket.disconnect()
            reject("connect_error")
        })

        setTimeout(() => {
            socket.disconnect()
            reject("timeout")
        }, 30000)
    })
}

/**
 * Scans network for servers and sets state if server is found
 * 
 * @param setState {function} function to set state
 * @returns {Promise<void>}
 */
export default async function scanNetworkAndSetState(setState: any) {
    try {
        // Fetch network details
        const status: any = await NetInfo.fetch();

        if (status.details == null || status.details.ipAddress == null || status.details.subnet == null) {
            throw new Error("No network connection")
        }

        const ipAddress = status.details.ipAddress
        const subnet = "255.255.255.255" == status.details.subnet ? "255.255.255.0" : status.details.subnet

        // Get network range
        const subnetDetails = ip.subnet(ipAddress, subnet)
        let firstAddress = subnetDetails.firstAddress.split(".").map((x: string) => parseInt(x))
        let lastAddress = subnetDetails.lastAddress.split(".").map((x: string) => parseInt(x))

        // Scan network
        let currentAddress: Array<number> = firstAddress.slice()
        let promises: any[] = []

        // Generate promises for each ip address in network range
        while (JSON.stringify(currentAddress) !== JSON.stringify(lastAddress)) {
            promises.push(checkIp(currentAddress.join("."), setState))
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

        // TODO: Change this to a better solution
        setInterval(async () => { const result = await Promise.allSettled(promises) }, 30000)

    } catch (error) {
        console.error(error)
    }
}