import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {Platform, Text} from "react-native";
import {useEffect, useRef, useState} from "react";
import { InstalledApps } from 'react-native-launcher-kit';

const CreateAlert = () => {

    let appsFetched = useRef<boolean>(false);
    const [apps, setApps] = useState<any|null>(null);

    useEffect(() => {

        if (!appsFetched.current) {
            appsFetched.current = true;
            (async () => {

                if(Platform.OS !== "web"){
                    const Apps = InstalledApps.getApps();
                    console.log(Apps);
                    setApps(Apps);
                }

            })();
        }

    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView className={"flex flex-col items-center justify-center w-full h-full p-4"}>
                <Text className={"text-2xl font-bold text-center"}> Create Alert </Text>

                {/*{ apps &&*/}
                {/*    <FlatList*/}
                {/*        className={"mt-4 p-2 w-full"}*/}
                {/*        data={apps}*/}
                {/*        renderItem={ (i: any) =>  {*/}
                {/*            return (*/}
                {/*                <View className={"flex bg-transparent my-2 flex-row items-center justify-between shadow w-full rounded-2xl p-4"}>*/}
                {/*                    <Text className={"bg-transparent text-2xl font-bold"}>{i.item.label}</Text>*/}
                {/*                    <Text className={"bg-transparent text-2xl font-bold"}>{i.item.packageName}</Text>*/}
                {/*                </View>*/}
                {/*            )*/}
                {/*        }}*/}
                {/*        keyExtractor={item => item.id}*/}
                {/*    />*/}
                {/*}*/}

            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default CreateAlert;