import { Stack } from "expo-router";
import {SafeAreaView} from "react-native";

export default function RootLayout({children}: any) {
  return <SafeAreaView>
      <Stack>
        {children}
      </Stack>
  </SafeAreaView>;
}
