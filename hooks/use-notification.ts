import * as Notifications from 'expo-notifications';

const useNotification = () => {

    Notifications.setNotificationHandler({
        handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
            shouldShowList: false,
            shouldPlaySound: false,
            shouldShowBanner: true,
            shouldSetBadge: false,
        }),
    });

    const showLocalNotification = async (title: string, body: string) => {
        try{
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                },
                trigger: null
            });
        }catch (e){
            console.log(e);
        }
    }

    return { showLocalNotification }
}

export default useNotification;