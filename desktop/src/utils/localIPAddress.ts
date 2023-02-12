import ip from "ip";

export const getLocalIPAddress = () => {
    console.log(ip.address());
    return ip.address();
}
