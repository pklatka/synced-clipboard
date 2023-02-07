import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import scanNetworkAndSetState from "../utils/networkScanner";
import { useEffect, useState } from 'react';
import ServerItem from "./ServerItem";

export default function Main({ navigation }) {
    const [ips, setIps] = useState([])

    useEffect(() => {
        scanNetworkAndSetState(setIps)
    }, [])

    return (
        <View style={styles.container}>
            <View>
                {ips.length > 0 ? ips.map(ip => <ServerItem key={ip} navigation={navigation} ip={ip} />)
                    : <ActivityIndicator size="large" />}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
