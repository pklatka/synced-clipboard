import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert, AppState, TouchableOpacity } from "react-native";
import ConnectionManager from "../utils/connectionManager";
import { getContentFromClipboard, startClipboardInterval, stopClipboardInterval } from "../utils/clipboardManager";
import { ConnectionViewProps } from "../types/rootStackParamList";
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Component representing the screen where the user can interact with the server.
 */
export default function ConnectionView({ navigation, route }: ConnectionViewProps): JSX.Element {
    let connectionView: ConnectionManager;

    // Refresh connectionView when app comes to foreground.
    const appState = useRef(AppState.currentState);
    useEffect(() => {
        const subscription = AppState.addEventListener('change', async nextAppState => {
            try {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    await connectionView.refresh()
                }

                appState.current = nextAppState;
            } catch (err) {
                console.error(err)
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Add listener to beforeRemove event.
    useEffect(() => {
        navigation.addListener('beforeRemove', (e: any) => {
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
                            connectionView.close()
                            stopClipboardInterval()
                            navigation.dispatch(e.data.action)
                        },
                    },
                ]
            );
        })
    }, [])

    // Connect to server.
    useEffect(() => {
        connectionView = new ConnectionManager(route.params.ip)
        connectionView.create().then(() => {
            startClipboardInterval(connectionView)
        }).catch((error) => {
            console.error(error)
        })
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Connection with server:{"\n"}{route.params.ip}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { connectionView.emit('get-clipboard-content', null) }}>
                    <MaterialCommunityIcons name="file-download-outline" size={50} color="black" />
                    <Text>Get clipboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { getContentFromClipboard(connectionView.socket, true) }}>
                    <MaterialCommunityIcons name="file-upload-outline" size={50} color="black" />
                    <Text>Save clipboard</Text>
                </TouchableOpacity>
            </View>
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
    buttonContainer: {
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'center',
        width: '70%',
    },
    button: {
        marginLeft: 30,
        marginRight: 30,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',

    },
    text: {
        fontSize: 26,
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: 20,
    }
});
