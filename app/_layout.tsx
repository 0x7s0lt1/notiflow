import { Stack, useRouter} from "expo-router";
import "./global.css"
import {SafeAreaProvider} from "react-native-safe-area-context";
import { Text, TouchableOpacity} from "react-native";

export default function RootLayout() {

    const router = useRouter();

  return (
      <SafeAreaProvider>
          <Stack>
              <Stack.Screen name="index" options={{
                  headerBackVisible: false,
                  headerTitle: props => <Text className="text-2xl font-bold">NotiFlow</Text>,
                  headerRight: () => <TouchableOpacity className="p-2 border border-gray-200 rounded-xl" onPress={()=> router.push("/select-package")} ><Text>Create Alert</Text></TouchableOpacity>,
              }} />
              <Stack.Screen name="select-package" options={{ title: "Select App to listen to" }} />
              <Stack.Screen name="create/[packageName]" options={{ title: "Create Alert" }} />
              <Stack.Screen name="alert/[id]" options={{ title: "Alert" }} />
          </Stack>
      </SafeAreaProvider>
  );
}
