import { Stack } from "expo-router";
import "./global.css"

export default function RootLayout() {
  return <Stack>
      <Stack.Screen name="index" options={{title: "🔔 Notiflow"}} />
      <Stack.Screen name="select-package" options={{ title: "Select App to listen to"}} />
      <Stack.Screen name="create/[packageName]" options={{ title: "Create Alert"}} />
      <Stack.Screen name="alert/[id]" options={{ title: "Alert"}} />
  </Stack>;
}
