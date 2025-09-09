import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {Text} from "react-native";

const CreateAlert = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView className={"flex flex-col items-center justify-center w-full h-full p-4"}>
                <Text className={"text-2xl font-bold text-center"}> Create Alert </Text>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default CreateAlert;