import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {Link, useLocalSearchParams, useRouter} from "expo-router";
import {useEffect, useRef, useState} from "react";
import StorageItemType from "@/types/storage/StorageItemType";
import useAlertStorage from "@/hooks/use-alert-storage";
import {ActivityIndicator, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import AppDetail from "@/types/storage/AppDetailType";
import RNInstalledApplication from 'react-native-installed-application';
import {Image} from "expo-image";
import {AlertStatus} from "@/types/AlertStatus";

const CreateAlert = () => {

    const router = useRouter();
    const { packageName } = useLocalSearchParams();
    const { addAlert } = useAlertStorage();

    const [loading, setLoading] = useState<boolean>(true);
    const [app, setApp] = useState<AppDetail>();

    let appsFetched = useRef<boolean>(false);

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

    const onSubmit = async () => {

        setLoading(true);

        try{
            setError(null);


            if(!app){
                setError("App not found");
                return;
            }

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

            const alert: StorageItemType = {
                id: String( Date.now() ),
                status: AlertStatus.ACTIVE,
                targetPackage: app,
                triggers: triggerArray,
                webhook_url: trimmedHookURL,
                payload: orderObject
            };

            await addAlert(alert);

            ToastAndroid.show("Alert created successfully", ToastAndroid.LONG);
            router.replace("/");

        }catch (e) {
            console.log(e);
            setError("Something went wrong");
        }finally {
            setLoading(false);
        }

    };

    useEffect(() => {

        if (!appsFetched.current && packageName) {

            appsFetched.current = true;

            (async () => {

                const allApps =  await RNInstalledApplication.getApps();
                const selectedApp = allApps.find((app: AppDetail) => app.packageName === packageName);

                if(selectedApp){
                    setApp(selectedApp);
                    setLoading(false);
                }

            })();
        }

    },[packageName])

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex flex-col items-center justify-center p-2  w-full">
                { loading && !app ?
                    <ActivityIndicator size="large" />
                    :
                    <View className="flex flex-col items-center justify-center p-2 gap-4 w-full">

                        <View className="flex flex-col items-center justify-center w-full gap-2">
                            <Image width={64} height={64} source={{ uri: `data:image/png;base64,${app?.icon}` }}  />
                            <View className="flex flex-col items-center justify-center">
                                <Text className="text-2xl font-bold">{app?.appName}</Text>
                                <Text>{app?.packageName}</Text>
                            </View>
                        </View>

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

                        <View className="flex flex-col items-center justify-center w-full gap-2">
                            <TouchableOpacity style={styles.saveButton} onPress={onSubmit} className="items-center justify-center button w-full p-4 flex flex-col rounded-2xl">
                                <Text className="text-white text-lg font-bold">Save</Text>
                            </TouchableOpacity>
                            <Link style={styles.cancelButton} href="/" className="w-full p-4 flex flex-row rounded-2xl">
                                <TouchableOpacity onPress={onSubmit} className="items-center justify-center button w-full flex flex-col">
                                    <Text className="text-white text-lg font-bold">Cancel</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>

                    </View>

                }
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    saveButton: {
        backgroundColor: "rgba(37,99,235,0.44)",
    },
    cancelButton: {
        backgroundColor: "rgba(239,68,68,0.66)",
    }
})

export default CreateAlert;