import { View, Text, StyleSheet } from "react-native";

export default function Connection({ navigation, route }) {
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
