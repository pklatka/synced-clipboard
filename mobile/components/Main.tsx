import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import scanNetworkAndSetState from "../utils/networkScanner";
import { useEffect, useState } from 'react';
import ServerItem from "./ServerItem";
import ReloadButton from "./ReloadButton";

interface MainProps {
    navigation: any // TODO: Change this to a proper type
}

export default function Main({ navigation }: MainProps) {
    const [ips, setIps] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Set the header right button
        navigation.setOptions({
            headerRight: () => (
                <ReloadButton onPressAction={async () => {
                    setLoading(true)
                    setIps([])
                    await scanNetworkAndSetState(setIps)
                    setLoading(false)
                }} />
            ),
        });

        async function startScanningNetwork() {
            await scanNetworkAndSetState(setIps)
            setLoading(false)
        }

        if (loading) {
            startScanningNetwork()
        }
    }, [])

    return (
        <View style={styles.container}>
            {ips.length > 0 && ips.map(ip => <ServerItem key={ip} navigation={navigation} ip={ip} />)}
            {ips.length === 0 && (loading ? <ActivityIndicator size={70} color="#000000" /> : <Text style={styles.text}>No servers found.{"\n"}Press reload button to retry.</Text>)}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 20
    },
    text: {
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        lineHeight: 27
    }
});
