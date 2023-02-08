import { TouchableOpacity, Image } from "react-native";

interface ReloadButtonProps {
    onPressAction: () => void;
}

export default function ReloadButton({ onPressAction }: ReloadButtonProps) {
    return (
        <TouchableOpacity onPress={onPressAction}>
            <Image
                style={{ width: 25, height: 25, resizeMode: 'contain' }}
                source={require('../assets/refresh-icon.png')}
            />
        </TouchableOpacity>
    );
}