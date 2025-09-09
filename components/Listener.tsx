import {Alert, AppRegistry} from "react-native";
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import {useEffect, useRef, useState} from "react";
import useAlertStorage from "@/hooks/use-alert-storage";
import {Notifications} from "react-native-notifications";
import {AlertStatus} from "@/types/AlertStatus";

const Listener = () => {

    enum PermissionStatus {
        AUTHORIZED = "authorized",
        GRANTED = "granted",
        DENIED = "denied",
        UNKNOWN = "unknown"
    }

    const { storage } = useAlertStorage();

    let statusChecked = useRef<boolean>(false);
    let taskRegistered = useRef<boolean>(false);

    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus|unknown>(PermissionStatus.UNKNOWN);

    useEffect(() => {

        if(!statusChecked.current){
            statusChecked.current = true;

            (async ()=>{
                if(permissionStatus !== PermissionStatus.AUTHORIZED){
                    await requestPermission();
                }
            })();
        }

        return () => {
            statusChecked.current = false;
        }

    });

    const requestPermission = async () => {

        setPermissionStatus(
            await RNAndroidNotificationListener.getPermissionStatus()
        );

        if(![PermissionStatus.AUTHORIZED, PermissionStatus.GRANTED].includes(permissionStatus as any)){
            Alert.alert("Notification permission is required", `Please grant notification permission to use this app`,[
                {
                    text: "Go to Settings",
                    onPress: () => {
                        RNAndroidNotificationListener.requestPermission();
                    }
                }
            ]);
        }

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

            const appAlerts = storage.filter((alert) => alert.targetPackage.appName === notification.app && alert.status === AlertStatus.ACTIVE);

            if(appAlerts.length > 0){

                const notificationText = [
                    notification.title,
                    notification.titleBig,
                    notification.text,
                    notification.subText,
                    notification.summaryText,
                    notification.bigText,
                    notification.extraInfoText,
                    notification.groupedMessages.map((message: any) => [message.title, message.text].join(" ")).join(" "),
                ].join(" ");

                for(const alert of appAlerts){

                    if( alert.triggers.some((trigger: string) => notificationText.includes(trigger)) ){
                        try{

                            await fetch(alert.webhook_url,{
                                method: "POST",
                                body: alert.payload
                            });

                            // let localNotification = Notifications.postLocalNotification({
                            //     title: `Alert sent!`,
                            //     body: `A notification from ${alert.targetPackage.appName} triggered an alert.`
                            // });

                        }catch (error){
                            console.log(error);
                        }
                    }

                }

            }

        }

    }

    useEffect(() => {

        if([PermissionStatus.AUTHORIZED, PermissionStatus.GRANTED].includes(permissionStatus as any) && !taskRegistered.current){
            taskRegistered.current = true;
            AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName,	() => headlessNotificationListener)
            console.log("Headless task registered")
        }

    },[PermissionStatus.AUTHORIZED, PermissionStatus.GRANTED, headlessNotificationListener, permissionStatus]);

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
        <></>
    )
}

export default Listener;