import {useLocalSearchParams} from "expo-router";
import {useRef, useState, useEffect} from "react";
import StorageItemType from "@/types/storage/StorageItemType";
import useAlertStorage from "@/hooks/use-alert-storage";
import {useRouter} from "expo-router";
import {
    ActivityIndicator,
    TextInput as RNTextInput,
    View,
    Text,
    ToastAndroid,
    Alert,
    KeyboardAvoidingView, ScrollView, StyleSheet
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {HttpMethod} from "@/types/HttpMethod";
import {Picker} from "@react-native-picker/picker";
import {Surface, Avatar, Button, TextInput} from 'react-native-paper';

const AlertView = () => {

    const router = useRouter();

    const { id } = useLocalSearchParams();
    const { storage, fetchStorage, replaceAlert, removeAlert } = useAlertStorage();

    let alertFetched = useRef<boolean>(false);
    const [alert, setAlert] = useState<StorageItemType | null>(null);

    const [triggerString, setTriggerString] = useState<string>("");
    const [triggerArray, setTriggerArray] = useState<string[]>([]);
    const [httpMethod, setHttpMethod] = useState<HttpMethod>(HttpMethod.POST);
    const [webhookURL, setWebhookURL] = useState<string>("");
    const [payloadFields, setPayloadFields] = useState<{key:string, value:string}[]>([ {key:"", value:""} ]);

    const [error, setError] = useState<string|null>(null);

    const handleTriggerChange = (text: string) => {
        setTriggerString(text);
        setTriggerArray(text.split(",").map((trigger: string) => trigger.trim()));
    };

    const handleHttpMethodChange = (method: HttpMethod) => {
        setHttpMethod(method);
    };

    const handleWebhookURLChange = (text: string) => {
        setWebhookURL(text);
    };

    const handlePayloadFieldChange = (index: number, property: "key" | "value", value: string) => {
        let newPayloadFields = [...payloadFields];
        newPayloadFields[index][property] = value;
        setPayloadFields(newPayloadFields);
    };
    const addPayloadField = () => {
        setPayloadFields([...payloadFields, {key:"", value:""}]);
    };

    const removePayloadField = (index: number) => {
        let newPayloadFields = [...payloadFields];
        if(newPayloadFields.length <= 1){
            newPayloadFields = [];
        }else{
            newPayloadFields.splice(index, 1);
        }
        setPayloadFields(newPayloadFields);
    };

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
                            router.replace("/");
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

                const payloadObject = payloadFields.reduce((acc, field) => {
                    acc[field.key] = field.value;
                    return acc;
                }, {} as Record<string, string>);

                const updatedAlert: StorageItemType = {
                    id: alert.id,
                    status: alert.status,
                    targetPackage: alert.targetPackage,
                    triggers: triggerArray,
                    webhook: {
                        url: trimmedHookURL,
                        method: httpMethod,
                        payload: payloadObject
                    },
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
                    setWebhookURL(a.webhook.url);
                    setHttpMethod(a.webhook.method);
                    setPayloadFields(
                        a.webhook.payload && Object.keys(a.webhook.payload).length > 0 ?
                        Object.entries(a.webhook.payload).map(([key, value]) => ({key, value}))
                            : []
                    );
                }

            })();
        }


    },[fetchStorage, id, storage]);

    return (
        <SafeAreaView className="flex flex-col h-full w-full items-start justify-center p-4">
            <ScrollView className="w-full">
                { alert === null ?
                    <View>
                        <ActivityIndicator size="large" />
                    </View> :
                    <KeyboardAvoidingView className="flex flex-col items-center justify-start w-full h-full p-4">

                        <View className="flex flex-col items-center justify-center w-full gap-2">
                            <Avatar.Image size={100} source={{uri: `data:image/png;base64,${alert.targetPackage.icon}`}}  />
                            <Text className="text-2xl font-bold">{alert.targetPackage.appName}</Text>
                            <Text>{alert.targetPackage.packageName}</Text>
                        </View>

                        <Surface style={{padding: 12, borderRadius: 12}} className={"w-full my-4 p-4 flex flex-col gap-2 border border-gray-200 rounded-2xl"}>
                            <View className="my-4">
                                <Text className="text-lg font-bold">Triggers</Text>
                                <TextInput
                                    className="w-full border border-gray-200 text-black rounded-md p-2"
                                    placeholder="example,triggers,here..."
                                    value={triggerString}
                                    onChangeText={handleTriggerChange}
                                    keyboardType="default"
                                    placeholderTextColor={"gray"}
                                    autoCapitalize="none"
                                />
                                <Text className="text-sm text-gray-500">Place triggers separated by commas</Text>
                            </View>
                            <View>
                                <Text className="text-lg font-bold">HTTP Method</Text>
                                <Picker
                                    style={styles.textBlack}
                                    className="w-full border border-gray-200 rounded-md p-2"
                                    selectedValue={httpMethod}
                                    onValueChange={handleHttpMethodChange}
                                >
                                    {
                                        Object.keys(HttpMethod).map((method: string) => {
                                            return (
                                                <Picker.Item style={styles.textBlack}  key={method} label={method} value={method} />
                                            )
                                        })
                                    }
                                </Picker>
                                <Text className="text-sm text-gray-500">Select HTTP method</Text>
                            </View>
                            <View>
                                <Text className="text-lg font-bold">Webhook URL</Text>
                                <TextInput
                                    className="w-full border border-gray-200 text-black rounded-md p-2"
                                    placeholder="https://example.com/webhook"
                                    value={webhookURL}
                                    onChangeText={handleWebhookURLChange}
                                    inputMode={"url"}
                                    dataDetectorTypes={"link"}
                                    keyboardType="default"
                                    placeholderTextColor={"gray"}
                                    autoCapitalize="none"
                                />
                                <Text className="text-sm text-gray-500">Paste your webhook URL here</Text>
                            </View>
                            <View>
                                <View className="flex flex-row items-center justify-between">
                                    <Text className="text-lg font-bold">Payload Fields</Text>
                                    <Button mode="contained-tonal" className="p-2" onPress={addPayloadField}>
                                        + Add Field
                                    </Button>
                                </View>
                                {
                                    payloadFields.map((field, index) => {
                                        return (
                                            <View key={index} className="flex flex-col gap-2 items-center justify-between border border-gray-200 rounded-md p-2 my-2">
                                                <RNTextInput
                                                    className="w-full border border-gray-200 text-black rounded-md p-2"
                                                    placeholder="Key"
                                                    value={field.key}
                                                    onChangeText={(text) => handlePayloadFieldChange(index, "key", text)}
                                                    placeholderTextColor={"gray"}
                                                    autoCapitalize="none"
                                                    keyboardType="default"
                                                />
                                                <RNTextInput
                                                    className="w-full border border-gray-200 text-black rounded-md p-2"
                                                    placeholder="Value"
                                                    value={field.value}
                                                    onChangeText={(text) => handlePayloadFieldChange(index, "value", text)}
                                                    placeholderTextColor={"gray"}
                                                    autoCapitalize="none"
                                                    keyboardType="default"
                                                />
                                                <Button mode="contained-tonal" onPress={() => removePayloadField(index)} className="w-full flex items-center justify-center">
                                                    - Remove field
                                                </Button>
                                            </View>
                                        )})
                                }
                                <Text className="text-sm text-gray-500">Add payload keys and values</Text>
                            </View>
                            { error &&
                                <Text className="text-red-500 my-2">Error: {error}</Text>
                            }
                        </Surface>


                        <View className="flex flex-col items-center justify-center w-full mt-4 gap-2">
                            <Button mode="contained" onPress={onSubmit} className="flex flex-row items-center justify-center w-full ">
                                Save
                            </Button>
                            <Button mode="outlined" style={styles.redButton} onPress={handleDeletePress} className="flex flex-row items-center justify-center w-full ">
                                Delete
                            </Button>
                        </View>
                    </KeyboardAvoidingView>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    redButton:{
        backgroundColor: "rgba(255,0,0,0.51)",
        color: "white",
    },
    textBlack:{
        color: "black",
    }
});

export default AlertView;