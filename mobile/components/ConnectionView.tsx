import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert, AppState } from "react-native";
import ConnectionManager from "../utils/connectionManager";
import { getContentFromClipboard, startClipboardInterval, stopClipboardInterval } from "../utils/clipboardManager";
import ImageButton from "./ImageButton";
import { ConnectionViewProps } from "../types/rootStackParamList";

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
                <ImageButton style={styles.imageButton} size={40} onPressAction={() => { connectionView.emit('get-clipboard-content', null) }} source={require('../assets/file-download-icon.png')} title={"Get clipboard"} />
                <ImageButton style={styles.imageButton} size={40} onPressAction={() => { getContentFromClipboard(connectionView.socket, true); }} source={require('../assets/upload-file-icon.png')} title={"Save clipboard"} />
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
    imageButton: {
        marginLeft: 30,
        marginRight: 30
    },
    text: {
        fontSize: 26,
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: 20,
    }
});
