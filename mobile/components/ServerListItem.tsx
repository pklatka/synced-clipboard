import { Text, TouchableHighlight, View, StyleSheet, Image } from "react-native";

type ServerItemProps = {
    onPressAction: () => void,
    ip: string
}

/**
 * A list item that displays an ip and a cloud icon.
 * 
 * @param onPressAction The function to call when the item is pressed.
 * @param ip The ip of the server.
 */
export default function ServerListItem({ onPressAction, ip }: ServerItemProps): JSX.Element {
    return (
        <TouchableHighlight underlayColor='none'
            onPress={onPressAction}>
            <View style={styles.container}>
                <Text style={styles.text}>{ip}</Text>
                <Image
                    style={{ width: 50, height: 50, resizeMode: 'contain' }}
                    source={require('../assets/cloud-server-icon.png')}
                />
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        marginBottom: 13,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#DDDDDD',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    }
})