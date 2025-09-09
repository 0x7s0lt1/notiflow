import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams} from "expo-router";
import {useRef, useState, useEffect} from "react";
import StorageItemType from "@/types/storage/StorageItemType";
import useAlertStorage from "@/hooks/use-alert-storage";
import {ActivityIndicator, Text, View} from "react-native";

const Alert = () => {

    const { id } = useLocalSearchParams();
    const { storage } = useAlertStorage();

    let alertFetched = useRef<boolean>(false);
    const [alert, setAlert] = useState<StorageItemType | null>(null);

    useEffect(() => {

        if (!alertFetched.current && id) {

            alertFetched.current = true;

            (async () => {

                const a = storage.find((alert: StorageItemType) => alert.id === id);
                if (a) {
                    setAlert(a);
                }

            })();
        }

    },[id, storage])

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 h-full w-full flex-row items-center justify-center p-4">
                { alert !== null ?
                    <View className="flex flex-col items-center justify-center w-full h-full p-4">
                        <Text>{alert.targetPackage.label}</Text>
                        <Text>{alert.targetPackage.packageName}</Text>
                        <Text>{alert.targetPackage.version}</Text>
                        <Text>{alert.targetPackage.accentColor}</Text>
                        <Text>{alert.targetPackage.icon}</Text>
                        <Text>{alert.triggers.join(", ")}</Text>
                        <Text>{alert.webhook_url}</Text>
                    </View>
                    :
                    <ActivityIndicator size="large" />
                }
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default Alert;