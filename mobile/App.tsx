import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectionSelection from "./components/ConnectionSelection";
import ConnectionView from "./components/ConnectionView";
import { RootStackParamList } from './types/rootStackParamList';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * The main app component.
 */
export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ConnectionSelection"
          component={ConnectionSelection}
          options={{
            title: 'Synced clipboard'
          }}
        />
        <Stack.Screen
          name="ConnectionView"
          component={ConnectionView}
          options={{
            title: "Synced clipboard"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
