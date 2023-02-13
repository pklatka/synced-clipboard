import { TouchableOpacity, Image, ViewStyle, Text, View, StyleSheet } from "react-native";

type ImageButtonProps = {
    onPressAction: () => void;
    source: any;
    size?: number;
    style?: ViewStyle;
    title?: string;
}

/**
 *  A button that displays an image and an optional title.
 * 
 * @param onPressAction The function to call when the button is pressed.
 * @param source The image to display.
 * @param style The style of the button.
 * @param size The size of the image (optional).
 * @param title The title of the button (optional).
 */
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