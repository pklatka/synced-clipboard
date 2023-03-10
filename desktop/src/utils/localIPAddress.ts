import ip from "ip";

/**
 * Get the local IP address of the machine
 * @returns {string} The local IP address
 */
export const getLocalIPAddress = (): string => {
    return ip.address();
}
