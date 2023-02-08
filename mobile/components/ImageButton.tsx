import { TouchableOpacity, Image, ViewStyle, Text, View, StyleSheet } from "react-native";

type ImageButtonProps = {
    onPressAction: () => void;
    source: any;
    size?: number;
    style?: ViewStyle;
    title?: string;
}

export default function ImageButton({ onPressAction, source, style, size = 25, title = "" }: ImageButtonProps): JSX.Element {
    return (
        <View style={style}>
            <TouchableOpacity style={styles.container} onPress={onPressAction}>
                <Image
                    style={{ width: size, height: size, resizeMode: 'contain' }}
                    source={source}
                />
                {title && <Text style={styles.text}>{title}</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
    }
})