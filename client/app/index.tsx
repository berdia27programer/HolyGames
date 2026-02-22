import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { useFonts, PixelifySans_400Regular } from '@expo-google-fonts/pixelify-sans';
import Welcome from './welcome';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pixelify': PixelifySans_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000000", justifyContent: "center" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#000000", height: "100vh", flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Welcome />
    </View>
  );
}