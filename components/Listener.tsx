import {AppRegistry, Text} from "react-native";
import RNAndroidNotificationListener, {
    RNAndroidNotificationListenerHeadlessJsName
} from 'react-native-android-notification-listener';
import {useEffect, useRef, useState} from "react";
import useAlertStorage from "@/hooks/use-alert-storage";
import {AlertStatus} from "@/types/AlertStatus";
import {HttpMethod} from "@/types/HttpMethod";
import useNotification from "@/hooks/use-notification";
import StorageItemType from "@/types/storage/StorageItemType";

const Listener = () => {

    enum PermissionStatus {
        AUTHORIZED = "authorized",
        DENIED = "denied",
        UNKNOWN = "unknown"
    }

    const { fetchStorage } = useAlertStorage();
    const { showLocalNotification } = useNotification();

    let statusChecked = useRef<boolean>(false);
    let taskRegistered = useRef<boolean>(false);

    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus|unknown>(PermissionStatus.UNKNOWN);

    useEffect(() => {

        if(!statusChecked.current){
            statusChecked.current = true;

            (async ()=>{
                setPermissionStatus(
                    await RNAndroidNotificationListener.getPermissionStatus()
                );
            })();
        }

    },[]);

    const requestPermission = async () => {

        setPermissionStatus(
            await RNAndroidNotificationListener.getPermissionStatus()
        );

        RNAndroidNotificationListener.requestPermission();

    }

    const headlessNotificationListener = async ({ notification }) => {/**
     * This notification is a JSON string in the follow format:
     *  {
     *      "time": string,
     *      "app": string,
     *      "title": string,
     *      "titleBig": string,
     *      "text": string,
     *      "subText": string,
     *      "summaryText": string,
     *      "bigText": string,
     *      "audioContentsURI": string,
     *      "imageBackgroundURI": string,
     *      "extraInfoText": string,
     *      "groupedMessages": Array<Object> [
     *          {
     *              "title": string,
     *              "text": string
     *          }
     *      ],
     *      "icon": string (base64),
     *      "image": string (base64), // WARNING! THIS MAY NOT WORK FOR SOME APPLICATIONS SUCH TELEGRAM AND WHATSAPP
     *  }
     *
     * Note that these properties depend on the sender configuration so many times a lot of them will be empty
     */

        if (notification) {

            const parsedNotification = JSON.parse(notification);
            const storage = await fetchStorage();
            const appAlerts = storage.filter((alert: StorageItemType) => alert.targetPackage.packageName === parsedNotification.app && alert.status === AlertStatus.ACTIVE);

            if(appAlerts.length > 0){

                const notificationText = [
                    parsedNotification.title,
                    parsedNotification.titleBig,
                    parsedNotification.text,
                    parsedNotification.subText,
                    parsedNotification.summaryText,
                    parsedNotification.bigText,
                    parsedNotification.extraInfoText,
                    ...parsedNotification.groupedMessages.map((message: any) => [message.title, message.text].join(" ")),
                ].join(" ");

                for(const alert of appAlerts){

                    if( alert.triggers.some((trigger: string) => notificationText.includes(trigger)) ){
                        try{

                            const url = alert.webhook.method === HttpMethod.GET ?
                                alert.webhook.url + "?" + new URLSearchParams(alert.webhook.payload).toString() :
                                alert.webhook.url;

                            let options: any = {
                                method: alert.webhook.method,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }
                            if(alert.webhook.method !== HttpMethod.GET && alert.webhook.payload && Object.keys(alert.webhook.payload).length > 0){
                                options.body = JSON.stringify(alert.webhook.payload);
                            }
                            if(alert.webhook.headers && Object.keys(alert.webhook.headers).length > 0){
                                Object.assign(options.headers, alert.webhook.headers)
                            }

                            try{

                                const response = await fetch(url, options);
                                if(response.ok){
                                    await showLocalNotification("NotiFlow Triggered!", `A notification from ${alert.targetPackage.appName} triggered an alert. Response status: ${response.status}`);
                                }

                            }catch (error){
                                console.log(error);
                                await showLocalNotification("Notiflow Error", `Could not trigger alert for notification from ${alert.targetPackage.appName},Reason: ${JSON.stringify(error)}`);
                            }

                        }catch (error){
                            console.log(error);
                        }
                    }

                }

            }

        }

    }

    useEffect(() => {

        if(!taskRegistered.current){
            taskRegistered.current = true;
            AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName,	() => headlessNotificationListener)
            console.log("Headless task registered")
        }

    },[headlessNotificationListener, permissionStatus]);

    /**
     * This should be required early in the sequence
     * to make sure the JS execution environment is setup before other
     * modules are required.
     *
     * Your entry file (index.js) would be the better place for it.
     *
     * PS: I'm using here the constant RNAndroidNotificationListenerHeadlessJsName to ensure
     *     that I register the headless with the right name
     */

    return (
        permissionStatus !== PermissionStatus.AUTHORIZED ?
            <Text className={"text-center text-gray-500 text-xs"}>
                Please allow listen notifications permission to use this app <Text onPress={requestPermission} className={"text-blue-500 underline"}>here</Text>
            </Text> :
            <></>
    )
}

export default Listener;