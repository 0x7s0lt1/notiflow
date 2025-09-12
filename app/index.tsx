import {Text, View, FlatList, Alert, ToastAndroid, ScrollView} from "react-native";
import {useEffect, useRef} from "react";
import {Link} from "expo-router";
import useAlertStorage from "@/hooks/use-alert-storage";
import {AlertStatus} from "@/types/AlertStatus";
import {useIsFocused} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import Listener from "@/components/Listener";
import { Surface, Chip, Avatar, IconButton  } from 'react-native-paper';

export default function Index() {

    let storageFetched = useRef<boolean>(false);

    const isFocused = useIsFocused();
    const { storage, fetchStorage, setStatus } = useAlertStorage();

    const handleStatusPress = async (id: string, status: AlertStatus) => {
        Alert.alert("Set Status", `Are you sure you want to ${status === AlertStatus.ACTIVE ? "resume" : "pause"} this alert?`,
            [
                {
                    text: "Cancel"
                },
                {
                    text: "Set",
                    onPress: async () => {
                        await setStatus(id, status)
                        ToastAndroid.show("Status updated successfully", ToastAndroid.LONG);
                    }
                }
            ]
        )
    }

    useEffect(() => {

        if(!storageFetched.current){
            storageFetched.current = true;

            (async ()=>{
                try{
                   await fetchStorage();
                }catch (e){
                    console.log(e);
                }
            })();

        }

        return () => {
            storageFetched.current = false;
        }

    },[fetchStorage, isFocused])


  return (
      <SafeAreaView>
          <View className={"flex flex-col items-center justify-center p-2 gap-2 min-h-[80vh]"}>

              <Listener />

              { storage && storage.length > 0 ?

                  <FlatList
                      className={"flex flex-col gap-2 p-2 w-full pb-32"}
                      data={storage}
                      renderItem={ (i: any) =>  {
                          return (
                              <Surface style={{padding: 8, borderRadius: 12}} className={`${i.index === storage.length  ? "mb-16" : ""} flex flex-col items-center gap-2 justify-between my-2 max-w-full w-full`}>

                                  <View className={"flex flex-row items-center justify-between w-full"}>
                                      <Link href={`/alert/${i.item.id}`} className={"flex flex-row items-center gap-4"} >
                                          <View className={"flex flex-row items-center gap-2 text-md font-bold"}>
                                              <Avatar.Image className={"mx-2"} size={55} source={{uri: `data:image/png;base64,${i.item.targetPackage.icon}`}} />
                                              <View>
                                                  <Text className={"text-xl font-bold"}>{i.item.targetPackage.appName}</Text>
                                                  <Text className={"text-xs text-muted-foreground"}>{i.item.targetPackage.packageName}</Text>
                                              </View>
                                          </View>
                                      </Link>

                                      {/*<View className={"flex flex-row items-center gap-2"}>*/}
                                      {/*    <Button*/}
                                      {/*        mode="contained-tonal"*/}
                                      {/*        icon={i.item.status === AlertStatus.ACTIVE ? "pause" : "play"}*/}
                                      {/*        onPress={async () => handleStatusPress(i.item.id, i.item.status === AlertStatus.ACTIVE ? AlertStatus.INACTIVE : AlertStatus.ACTIVE)}*/}
                                      {/*    >*/}
                                      {/*    </Button>*/}
                                      {/*</View>*/}
                                      <IconButton
                                          size={35}
                                          mode="contained-tonal"
                                          icon={i.item.status === AlertStatus.ACTIVE ? "pause" : "play"}
                                          onPress={async () => handleStatusPress(i.item.id, i.item.status === AlertStatus.ACTIVE ? AlertStatus.INACTIVE : AlertStatus.ACTIVE)}
                                      >
                                      </IconButton>
                                  </View>

                                  <View className={"flex flex-row items-center justify-start gap-2 w-full px-2"}>
                                      <ScrollView horizontal={true} style={{padding: 2}} >
                                          {
                                              i.item.triggers.map((trigger: any, index: number) => {
                                                  return (
                                                      <Chip mode="flat" style={{backgroundColor: "rgba(241,234,234,0.71)", borderRadius: 12, padding: 0}} key={index} className={"text-xs mx-1"}>
                                                          <Text>{trigger}</Text>
                                                      </Chip>
                                                  )
                                              })
                                          }
                                      </ScrollView>

                                  </View>

                              </Surface>
                          )
                      }}
                      keyExtractor={item => item.id}
                  /> :
                  <View className={"flex flex-col items-center justify-center h-[90vh]"}>
                      <Text className={"text-2xl font-bold text-center"}>No alerts</Text>
                  </View>

              }

              {/*<TouchableOpacity onPress={async ()=> await showLocalNotification("Test", "This is a test notification") } className={"p-2 border border-gray-200 rounded-xl"}>*/}
              {/*    <Text>Test notification</Text>*/}
              {/*</TouchableOpacity>*/}

          </View>
      </SafeAreaView>
  );
}
