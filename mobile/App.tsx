import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectionSelection from "./components/ConnectionSelection";
import ConnectionView from "./components/ConnectionView";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={ConnectionSelection}
          options={{
            title: 'Synced clipboard'
          }}
        />
        <Stack.Screen name="Connection" component={ConnectionView} options={{
          title: "Synced clipboard"
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
