import * as Notifications from 'expo-notifications';

const useNotification = () => {

    Notifications.setNotificationHandler({
        handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
            shouldShowAlert: true,
            shouldShowList: false,
            shouldPlaySound: true,
            shouldShowBanner: false,
            shouldSetBadge: false,
        }),
    });

    const showLocalNotification = async (title: string, body: string) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: null
        });
    }

    return { showLocalNotification }
}

export default useNotification;