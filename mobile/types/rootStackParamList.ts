import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  ConnectionSelection: undefined;
  ConnectionView: { ip: string };
};

export type ConnectionSelectionProps = NativeStackScreenProps<RootStackParamList, 'ConnectionSelection'>;
export type ConnectionViewProps = NativeStackScreenProps<RootStackParamList, 'ConnectionView'>;
