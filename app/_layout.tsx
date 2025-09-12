import { Stack, useRouter} from "expo-router";
import "./global.css"
import {SafeAreaProvider} from "react-native-safe-area-context";
import { Text } from "react-native";
import {PaperProvider} from "react-native-paper";
import { Button } from 'react-native-paper';

export default function RootLayout() {

    const router = useRouter();

  return (
      <SafeAreaProvider>
          <PaperProvider>
              <Stack>
                  <Stack.Screen name="index" options={{
                      headerBackVisible: false,
                      headerTitle: props => <Text className="text-2xl font-bold">Notiflow</Text>,
                      headerRight: () => <Button icon="plus" mode="contained" onPress={()=> router.push("/select-package")} >Create Alert</Button>,
                  }} />
                  <Stack.Screen name="select-package/index" options={{ title: "Select App to listen to" }} />
                  <Stack.Screen name="create/[packageName]" options={{ title: "Create Alert" }} />
                  <Stack.Screen name="alert/[id]" options={{ title: "Alert" }} />
              </Stack>
          </PaperProvider>
      </SafeAreaProvider>
  );
}
