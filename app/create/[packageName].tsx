import {useLocalSearchParams, useRouter} from "expo-router";
import {useState} from "react";
import StorageItemType from "@/types/storage/StorageItemType";
import useAlertStorage from "@/hooks/use-alert-storage";
import {KeyboardAvoidingView, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import {Image} from "expo-image";
import {AlertStatus} from "@/types/AlertStatus";
import {SafeAreaView} from "react-native-safe-area-context";
import {HttpMethod} from "@/types/HttpMethod";
import {Picker} from "@react-native-picker/picker";

const CreateAlert = () => {

    const router = useRouter();
    const { packageName, appName, versionName, icon } = useLocalSearchParams();
    const { addAlert } = useAlertStorage();

    const [loading, setLoading] = useState<boolean>(false);

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
        const newPayloadFields = [...payloadFields];
        newPayloadFields.splice(index, 1);
        setPayloadFields(newPayloadFields);
    };

    const handleCancel = () => {
        router.replace("/");
    }

    const onSubmit = async () => {

        setError(null);

        try{

            if(triggerArray.length === 0){
                setError("Trigger is required");
                return;
            }

            const trimmedHookURL = webhookURL.trim();

            try{
                new URL(trimmedHookURL);
            }catch (err: any) {
                setError("Invalid webhook URL");
                return;
            }

            const payloadObject = payloadFields.reduce((acc, field) => {
                acc[field.key] = field.value;
                return acc;
            }, {} as Record<string, string>);


            const alert: StorageItemType = {
                id: String( Date.now() ),
                status: AlertStatus.ACTIVE,
                targetPackage: {
                    packageName: packageName as string,
                    appName: appName as string,
                    versionName: versionName as string,
                    icon: icon as string
                },
                triggers: triggerArray,
                webhook: {
                    url: trimmedHookURL,
                    method: httpMethod,
                    payload: payloadObject
                },
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


    return (
        <SafeAreaView className="flex flex-col items-center justify-center p-2 w-full">
            <ScrollView className="w-full">
                <KeyboardAvoidingView className="flex flex-col items-center justify-center p-2 gap-4 w-full">

                    <View className="flex flex-col items-center justify-center w-full gap-2">
                        <Image width={100} height={100} source={{ uri: `data:image/png;base64,${icon}` }}  />
                        <View className="flex flex-col items-center justify-center">
                            <Text className="text-2xl font-bold">{appName}</Text>
                            <Text>{packageName}</Text>
                        </View>
                    </View>

                    <View className={"w-full my-4 p-4 flex flex-col gap-2 border border-gray-200 rounded-2xl"}>
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
                                className="w-full border border-gray-200 rounded-md p-2 text-black"
                                selectedValue={httpMethod}
                                onValueChange={handleHttpMethodChange}
                            >
                                {
                                    Object.keys(HttpMethod).map((method: string) => {
                                        return (
                                            <Picker.Item className="text-black"  key={method} label={method} value={method} />
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
                                <TouchableOpacity className="p-2 border border-gray-200 rounded-md" onPress={addPayloadField}>
                                    <Text>+ Add Field</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                payloadFields.map((field, index) => {
                                    return (
                                        <View key={index} className="flex flex-col gap-2 items-center justify-between border border-gray-200 rounded-md p-2 my-2">
                                            <TextInput
                                                className="w-full border border-gray-200 text-black rounded-md p-2"
                                                placeholder="Key"
                                                value={field.key}
                                                onChangeText={(text) => handlePayloadFieldChange(index, "key", text)}
                                                placeholderTextColor={"gray"}
                                                autoCapitalize="none"
                                                keyboardType="default"
                                            />
                                            <TextInput
                                                className="w-full border border-gray-200 text-black rounded-md p-2"
                                                placeholder="Value"
                                                value={field.value}
                                                onChangeText={(text) => handlePayloadFieldChange(index, "value", text)}
                                                placeholderTextColor={"gray"}
                                                autoCapitalize="none"
                                                keyboardType="default"
                                            />
                                            <TouchableOpacity onPress={() => removePayloadField(index)} className="p-2 w-full flex items-center justify-center border bg-red-200 border-gray-200 rounded-md">
                                                <Text>Remove</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )})
                            }
                            <Text className="text-sm text-gray-500">Add payload keys and values</Text>
                        </View>

                        { error &&
                            <Text className="text-red-500 my-2">Error: {error}</Text>
                        }

                    </View>

                    <View className="flex flex-col items-center justify-center w-full gap-2 mb-[20vw]">
                        <TouchableOpacity  onPress={onSubmit} className="flex flex-row items-center justify-center p-2 bg-blue-200 rounded-xl w-full border border-gray-500">
                            <Text>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancel} className="flex flex-row items-center justify-center p-2 bg-red-200 rounded-xl w-full border border-gray-500">
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}


export default CreateAlert;