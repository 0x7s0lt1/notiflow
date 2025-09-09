import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator, FlatList, Platform, Pressable, Switch, Text, TextInput, View} from "react-native";
import {useEffect, useRef, useState} from "react";
import RNInstalledApplication from 'react-native-installed-application';
import AppDetail from "@/types/storage/AppDetailType";
import {Image} from "expo-image";
import {Link} from "expo-router";

const SelectPackage = () => {

    let appsFetched = useRef<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [includeSystemApps, setIncludeSystemApps] = useState<boolean>(false);

    const [apps, setApps] = useState<AppDetail[]>([]);
    const [filteredApps, setFilteredApps] = useState<AppDetail[]>([]);

    const handleSearchChange = (text: string) => {
        setSearch(text);
    }

    const handleIncludeSystemAppsChange = async (value: boolean) => {
        setIncludeSystemApps(value);
        await fetchApps(value);

    }

    const toggleIncludeSystemApps = () => {
        setIncludeSystemApps(!includeSystemApps);
    }

    useEffect(() => {

        if (!appsFetched.current) {
            appsFetched.current = true;
            (async () => {
                await fetchApps(includeSystemApps);
            })();
        }

    }, []);

    const fetchApps = async (_includeSystemApps: boolean) => {
        if(Platform.OS !== "web"){
            setLoading(true);

            const Apps = _includeSystemApps ?
                await RNInstalledApplication.getApps() :
                await RNInstalledApplication.getNonSystemApps();
            setApps(Apps);

            setLoading(false);
        }
    }

    useEffect(() => {

        if(search.trim().length > 0){
            const filtered = apps.filter((app) => app.appName.toLowerCase().includes(search.toLowerCase()));
            setFilteredApps(filtered);
        }else{
            setFilteredApps(apps);
        }

    }, [apps, search]);

    return (
        <SafeAreaProvider>
            <SafeAreaView className={"flex flex-col items-center justify-center w-full h-full p-4"}>

                <View className={"w-full my-4 p-2"}>
                    <View className={"flex flex-row items-center justify-between w-full my-2"}>
                        <Text>
                            Search
                        </Text>
                        <View className={"flex flex-row items-center justify-end mt-2"}>
                            <Switch
                                value={includeSystemApps}
                                onValueChange={handleIncludeSystemAppsChange}
                            />
                            <Pressable onPress={toggleIncludeSystemApps}>
                                <Text className={"text-xs text-gray-500 ml-1"}>Include system apps</Text>
                            </Pressable>
                        </View>
                    </View>
                    <TextInput
                        className={"w-full border border-gray-200 text-primary rounded-xl p-2"}
                        onChangeText={handleSearchChange}
                        value={search}
                        placeholder="Type an app name to search..."
                        placeholderTextColor={"gray"}
                        keyboardType="default"
                    />

                </View>

                { loading ?
                    <View className={"flex-1 h-[calc(100vh-12rem)] min-h-[calc(100vh-12rem)] items-center justify-center w-full"}>
                        <ActivityIndicator size="large" />
                    </View> :
                    <FlatList
                        className={"mt-4 p-2 w-full"}
                        data={filteredApps}
                        renderItem={ (i: any) =>  {
                            return (
                                <Link href={`/create/${i.item.packageName}`} className={"flex my-2 border border-gray-200 items-center shadow rounded-2xl p-4"}>
                                    <View className={"flex flex-row items-center justify-start"}>
                                        <Image width={54} height={54} source={{uri: `data:image/png;base64,${i.item.icon}`}} />
                                        <View className={"flex flex-col items-center justify-start w-full"}>
                                            <Text className={"bg-transparent text-md font-bold break-all"}>{i.item.appName.length > 25 ? i.item.appName.slice(0, 25) + "..." : i.item.appName}</Text>
                                            <Text className={"bg-transparent text-xs"}>{i.item.packageName.length > 45 ? i.item.packageName.slice(0, 45) + "..." : i.item.packageName}</Text>
                                        </View>
                                    </View>
                                </Link>
                            )
                        }}
                        keyExtractor={item => item.packageName}
                    />

                }


            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default SelectPackage;