import { Stack } from "expo-router";
import "./global.css"
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

export default function RootLayout() {
  return <SafeAreaProvider>
      <SafeAreaView>
          <Stack>
              <Stack.Screen name="index" options={{ title: "🔔 Notiflow" }} />
              <Stack.Screen name="select-package" options={{ title: "Select App to listen to" }} />
              <Stack.Screen name="create/[packageName]" options={{ title: "Create Alert" }} />
              <Stack.Screen name="alert/[id]" options={{ title: "Alert" }} />
          </Stack>
      </SafeAreaView>
  </SafeAreaProvider>;
}
