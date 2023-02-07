import { Text, TouchableHighlight, View } from "react-native";

export default function ServerItem({ navigation, ip }) {

    return (
        <TouchableHighlight onPress={() => { navigation.navigate("Connection", { ip }) }}>
            <View>
                <Text>{ip}</Text>
            </View>
        </TouchableHighlight>
    )
}