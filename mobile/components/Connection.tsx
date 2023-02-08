import { useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import ConnectionManager from "../utils/connectionManager";
import { getContentFromClipboard, startClipboardInterval, stopClipboardInterval } from "../utils/clipboardManager";

let connection: ConnectionManager;

export default function Connection({ navigation, route }) {
    useEffect(() => {
        navigation.addListener('beforeRemove', e => {
            e.preventDefault()

            Alert.alert(
                'Disconnect from server?',
                'Are you sure to disconnect from server and leave the screen?',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => { } },
                    {
                        text: 'Disconnect',
                        style: 'destructive',
                        onPress: () => {
                            connection.close()
                            stopClipboardInterval()
                            navigation.dispatch(e.data.action)
                        },
                    },
                ]
            );

        })

        // Connect to server
        connection = new ConnectionManager(route.params.ip)
        connection.create().then(() => {
            // Run clipboard interval
            startClipboardInterval(connection)
        }).catch((error) => {
            console.error(error)
        })

    }, [])


    return (
        <View style={styles.container}>
            <Text>Connection {route.params.ip}</Text>
            <Button onPress={() => { connection.emit('get-clipboard-content', null) }}
                title="Get clipboard"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />

            <Button onPress={() => { getContentFromClipboard(connection.socket) }}
                title="Set clipboard"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
