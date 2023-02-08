import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import scanNetworkAndSetState from "../utils/networkScanner";
import { useEffect, useState } from 'react';
import ServerListItem from "./ServerListItem";
import ImageButton from "./ImageButton";

interface ConnectionSelectionProps {
    navigation: any // TODO: Change this to a proper type
}

export default function ConnectionSelection({ navigation }: ConnectionSelectionProps) {
    const [ips, setIps] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Set the header right button
        navigation.setOptions({
            headerRight: () => (
                <ImageButton onPressAction={async () => {
                    setLoading(true)
                    setIps([])
                    await scanNetworkAndSetState(setIps)
                    setLoading(false)
                }} source={require('../assets/refresh-icon.png')} />
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
            {ips.length > 0 && ips.map(ip => <ServerListItem key={ip} navigation={navigation} ip={ip} />)}
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
