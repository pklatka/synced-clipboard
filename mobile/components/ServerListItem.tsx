import { Text, TouchableHighlight, View, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        <TouchableHighlight style={styles.container} underlayColor='none'
            onPress={onPressAction}>
            <View style={styles.innerContainer}>
                <Text style={styles.text}>{ip}</Text>
                <MaterialCommunityIcons name="server-network" size={50} color="black" />
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    innerContainer: {
        maxWidth: 450,
        width: '100%',
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