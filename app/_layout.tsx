import { Stack } from "expo-router";
import "./global.css"
import {SafeAreaProvider, SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";

function WithPadding({ children }: { children: React.ReactNode }) {
    const insets = useSafeAreaInsets();
    return (
        <SafeAreaView style={{ flex: 1, paddingBottom: insets.bottom }}>
            {children}
        </SafeAreaView>
    );
}

export default function RootLayout() {
  return <SafeAreaProvider>
      <WithPadding>
          <Stack>
              <Stack.Screen name="index" options={{ title: "🔔 Notiflow" }} />
              <Stack.Screen name="select-package" options={{ title: "Select App to listen to" }} />
              <Stack.Screen name="create/[packageName]" options={{ title: "Create Alert" }} />
              <Stack.Screen name="alert/[id]" options={{ title: "Alert" }} />
          </Stack>
      </WithPadding>
  </SafeAreaProvider>;
}
