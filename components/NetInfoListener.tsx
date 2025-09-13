import { useNetInfo, addEventListener } from "@react-native-community/netinfo";
import {View, Text} from "react-native";
import useNotification from "@/hooks/use-notification";
import {useEffect, useRef} from "react";

const NetInfoListener = () =>{

    let isRegistered = useRef<boolean>(false);
    const { isConnected, isInternetReachable } = useNetInfo();
    const { showLocalNotification } = useNotification();


    const headlessNetInfoListener = async () => {

        addEventListener(async (state: any) => {
            if(!state.isConnected && !state.isInternetReachable){
                console.log("No internet connection!");
                await showLocalNotification(
                    "No Internet Connection",
                    "Notiflow unable to call webhooks. Check your internet connection."
                )
            }
        });

    }

    useEffect(() => {

        if(!isRegistered.current){
            isRegistered.current = true;
            (async ()=>{
                await headlessNetInfoListener();
            })();
        }
        
    }, []);

    return (
        !isConnected || !isInternetReachable ?
            <View className={"flex flex-col items-center justify-center w-screen"}>
                <Text>No internet connection!</Text>
            </View>
            : <></>
    )
}

export default NetInfoListener;
