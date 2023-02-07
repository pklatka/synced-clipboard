import { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

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
                            // TODO: Disconnect from server

                            navigation.dispatch(e.data.action)
                        },
                    },
                ]
            );

        })
    }, [])


    return (
        <View style={styles.container}>
            <Text>Connection {route.params.ip}</Text>
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
