import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import scanNetworkAndSetState from './utils/networkScanner'
import { useEffect, useState } from 'react';

export default function App() {
  const [ips, setIps] = useState([])
  useEffect(() => {
    scanNetworkAndSetState(setIps)
  }, [])


  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <View>
        {ips.map(ip => <View><Text>{ip}</Text></View>)}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
