import Main from "./components/Main";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Connection from './components/Connection';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Main}
          options={{
            title: 'Synced clipboard'
          }}
        />
        <Stack.Screen name="Connection" component={Connection} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
