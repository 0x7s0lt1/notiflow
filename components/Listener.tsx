import {Alert, View, AppRegistry} from "react-native";
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import {useEffect, useRef} from "react";
import useAlertStorage from "@/hooks/use-alert-storage";
import {Notifications} from "react-native-notifications";

const Listener = () => {

    enum PermissionStatus {
        AUTHORIZED = "authorized",
        DENIED = "denied",
        UNKNOWN = "unknown"
    }

    let statusChecked = useRef<boolean>(false);
    const { storage } = useAlertStorage();

    useEffect(() => {

        if(!statusChecked.current){
            statusChecked.current = true;

            (async ()=>{

                const status = await RNAndroidNotificationListener.getPermissionStatus()

                if(status !== PermissionStatus.AUTHORIZED){
                    Alert.alert("Notification permission is required to use this app");
                    RNAndroidNotificationListener.requestPermission();
                }

            })();
        }

    });

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

            const appAlerts = storage.filter((alert) => alert.targetPackage.appName === notification.app);

            if(appAlerts.length > 0){

                const notiFicationText = [
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

                    if( alert.triggers.some((trigger: string) => notiFicationText.includes(trigger)) ){
                        try{

                            await fetch(alert.webhook_url,{
                                method: "POST",
                                body: alert.payload
                            });

                            let localNotification = Notifications.postLocalNotification({
                                title: `Alert sent!`,
                                body: `A notification from ${alert.targetPackage.appName} triggered an alert.`
                            });

                        }catch (error){
                            console.log(error);
                        }
                    }

                }

            }

        }

    }

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
    if(!AppRegistry._headlessTasks?.[RNAndroidNotificationListenerHeadlessJsName]){
        AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName,	() => headlessNotificationListener)
    }


    return (
        <View />
    )
}

export default Listener;