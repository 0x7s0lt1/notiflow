import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams} from "expo-router";
import {useRef, useState, useEffect} from "react";
import StorageItemType from "@/types/storage/StorageItemType";
import useAlertStorage from "@/hooks/use-alert-storage";
import {useRouter} from "expo-router";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
    Image,
    ToastAndroid,
    Alert,
    TextInput
} from "react-native";
import {AlertStatus} from "@/types/AlertStatus";

const AlertView = () => {

    const router = useRouter();

    const { id } = useLocalSearchParams();
    const { storage, fetchStorage, replaceAlert, setStatus, removeAlert } = useAlertStorage();

    let alertFetched = useRef<boolean>(false);
    const [alert, setAlert] = useState<StorageItemType | null>(null);

    const [triggerString, setTriggerString] = useState<string>("");
    const [triggerArray, setTriggerArray] = useState<string[]>([]);
    const [webhookURL, setWebhookURL] = useState<string>("");
    const [orderObject, setOrderObject] = useState<string>("");

    const [error, setError] = useState<string|null>(null);

    const handleTriggerChange = (text: string) => {
        setTriggerString(text);
        setTriggerArray(text.split(",").map((trigger: string) => trigger.trim()));
    };

    const handleWebhookURLChange = (text: string) => {
        setWebhookURL(text);
    };

    const handleOrderObjectChange = (text: string) => {
        setOrderObject(text);
    };

    const handleStatusPress = async () => {
        if(alert){
            Alert.alert("Set Status", `Are you sure you want to ${alert.status === AlertStatus.ACTIVE ? "resume" : "pause"} this alert?`,
                [
                    {
                        text: "Cancel"
                    },
                    {
                        text: "Set",
                        onPress: async () => {
                            await setStatus(alert.id, alert.status === AlertStatus.ACTIVE ? AlertStatus.INACTIVE : AlertStatus.ACTIVE)
                            ToastAndroid.show("Status updated successfully", ToastAndroid.LONG);
                        }
                    }
                ]
            )
        }
    }

    const handleDeletePress = async () => {
        if(alert){
            Alert.alert("Delete Alert", `Are you sure you want to delete this alert?`,
                [
                    {
                        text: "Cancel"
                    },
                    {
                        text: "Delete",
                        onPress: async () => {
                            await removeAlert(alert.id)
                            ToastAndroid.show("Alert deleted successfully", ToastAndroid.LONG);
                        }
                    }
                ]
            )
        }
    }

    const onSubmit = async () => {

        try{

            setError(null);

            if(alert){

                if(triggerArray.length === 0){
                    setError("Trigger is required");
                    return;
                }

                const trimmedHookURL = webhookURL.trim();

                try{
                    new URL(trimmedHookURL);
                }catch (err) {
                    setError("Invalid webhook URL");
                    return;
                }

                const updatedAlert: StorageItemType = {
                    id: alert.id,
                    status: alert.status,
                    targetPackage: alert.targetPackage,
                    triggers: triggerArray,
                    webhook_url: trimmedHookURL,
                    payload: orderObject
                };

                Alert.alert("Update Alert", `Are you sure you want to update this alert?`,
                    [
                        {
                            text: "Cancel"
                        },
                        {
                            text: "Update",
                            onPress: async () => {
                                await replaceAlert(alert.id, updatedAlert);
                                ToastAndroid.show("Alert updated successfully", ToastAndroid.LONG);
                            }
                        }
                    ]
                )

            }

        }catch (e) {
            console.log(e);
            setError("Something went wrong");
        }

    };

    useEffect(() => {

        if (!alertFetched.current && id && storage) {

            (async () => {
                await fetchStorage();

                const a = storage.find((alert: StorageItemType) => String(alert.id) === String(id));
                if (a) {
                    alertFetched.current = true;
                    setAlert(a);
                    setTriggerString(a.triggers.join(", "));
                    setTriggerArray(a.triggers);
                    setWebhookURL(a.webhook_url);
                    setOrderObject(a.payload);
                }

            })();
        }

    },[fetchStorage, id, storage]);

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 h-full w-full flex-row items-center justify-center p-4">
                { alert === null ?
                    <View>
                        <ActivityIndicator size="large" />
                    </View> :
                    <View className="flex flex-col items-center justify-center w-full h-full p-4">
                        <Image width={100} height={100} source={{uri: `data:image/png;base64,${alert.targetPackage.icon}`}} className="w-24 h-24" />
                        <Text className="text-2xl font-bold">{alert.targetPackage.appName}</Text>
                        <Text>{alert.targetPackage.packageName}</Text>

                        <View className={"w-full my-4 p-4 flex flex-col gap-2 border border-gray-200 rounded-2xl"}>
                            <View className="my-4">
                                <Text className="text-lg font-bold">Triggers</Text>
                                <TextInput
                                    className="w-full border border-gray-200 rounded-md p-2"
                                    placeholder="example,triggers,here..."
                                    value={triggerString}
                                    onChangeText={handleTriggerChange}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                />
                                <Text className="text-sm text-gray-500">Place triggers separated by commas</Text>
                            </View>
                            <View>
                                <Text className="text-lg font-bold">Webhook</Text>
                                <TextInput
                                    className="w-full border border-gray-200 rounded-md p-2"
                                    placeholder="https://example.com/webhook"
                                    value={webhookURL}
                                    onChangeText={handleWebhookURLChange}
                                    inputMode={"url"}
                                    dataDetectorTypes={"link"}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                />
                                <Text className="text-sm text-gray-500">Paste your webhook URL here</Text>
                            </View>
                            <View>
                                <Text className="text-lg font-bold">Payload</Text>
                                <TextInput
                                    className="w-full border border-gray-200 rounded-md p-2"
                                    placeholder="{}"
                                    value={orderObject}
                                    onChangeText={handleOrderObjectChange}
                                    multiline
                                    numberOfLines={5}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                />
                                <Text className="text-sm text-gray-500">Paste your webhook payload here</Text>
                            </View>
                            { error &&
                                <Text className="text-red-500 my-2">Error: {error}</Text>
                            }
                        </View>


                        <View className="flex flex-col items-center justify-center w-full mt-4 gap-2">
                            <TouchableOpacity onPress={onSubmit} className="flex flex-row items-center justify-center p-2 bg-green-200 rounded-xl w-full border border-gray-500">
                                <Text>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleStatusPress} className="flex flex-row items-center justify-center p-2 bg-blue-200 rounded-xl w-full border border-gray-500">
                                <Text>{alert.status === AlertStatus.ACTIVE ? "Pause" : "Start"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeletePress} className="flex flex-row items-center justify-center p-2 bg-red-200 rounded-xl w-full border border-gray-500">
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }


            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default AlertView;