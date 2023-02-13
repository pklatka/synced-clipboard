import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import scanNetworkAndSetState from "../utils/networkScanner";
import { useEffect, useState } from 'react';
import ServerListItem from "./ServerListItem";
import { ConnectionSelectionProps } from "../types/rootStackParamList";
import { FontAwesome } from '@expo/vector-icons';
/**
 * Component representing the screen where the user can select a server to connect to.
 */
export default function ConnectionSelection({ navigation }: ConnectionSelectionProps): JSX.Element {
    // List of ips of servers found on the network.
    const [ips, setIps] = useState([])
    // Whether the component is loading.
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Set the header right button.
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={async () => {
                    setLoading(true)
                    setIps([])
                    await scanNetworkAndSetState(setIps)
                    setLoading(false)
                }}>
                    <FontAwesome name="refresh" size={28} color="black" />
                </TouchableOpacity>
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
            {ips.length > 0 && ips.map(ip => <ServerListItem key={ip} onPressAction={() => { navigation.navigate("ConnectionView", { ip }) }} ip={ip} />)}
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
