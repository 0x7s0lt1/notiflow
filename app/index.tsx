import {Text, View, FlatList, Alert, TouchableOpacity, ToastAndroid, ScrollView} from "react-native";
import {useEffect, useRef} from "react";
import {Link} from "expo-router";
import useAlertStorage from "@/hooks/use-alert-storage";
import {Play, Pause} from "lucide-react-native";
import {Image} from "expo-image";
import {AlertStatus} from "@/types/AlertStatus";
import {useIsFocused} from "@react-navigation/native";
import useNotification from "@/hooks/use-notification";

export default function Index() {

    let storageFetched = useRef<boolean>(false);

    const isFocused = useIsFocused();
    const { storage, fetchStorage, setStatus } = useAlertStorage();
    const { showLocalNotification } = useNotification();


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


                   await showLocalNotification("Test", "This is a test notification");

                   await fetchStorage();
                }catch (e){
                    console.log(e);
                }
            })();

        }

        return () => {
            storageFetched.current = false;
        }

    },[fetchStorage, isFocused, showLocalNotification])

  return (
      <View className={"flex flex-col items-center justify-center p-4 gap-2 min-h-[80vh]"}>

          {/*<Listener />*/}

          <Text className={"my-2"}>
              Webhook calls by listening to apps notifications
          </Text>
          { storage && storage.length > 0 ?

              <FlatList
                  className={"flex flex-col gap-2 p-2 w-full pb-32"}
                  data={storage}
                  renderItem={ (i: any) =>  {
                      return (
                          <View className={`${i.index === storage.length  ? "mb-16" : ""} flex flex-col items-center justify-between my-2 p-2 border border-gray-200 rounded-2xl max-w-full w-full shadow-xl`}>

                              <View className={"flex flex-row items-center justify-between w-full"}>
                                  <Link href={`/alert/${i.item.id}`} className={"flex flex-row items-center gap-4"} >
                                      <View className={"flex flex-row items-center gap-2 text-md font-bold"}>
                                          <Image className={"mx-2"} width={45} height={45} source={{uri: `data:image/png;base64,${i.item.targetPackage.icon}`}} />
                                          <View>
                                              <Text className={"text-xl font-bold"}>{i.item.targetPackage.appName}</Text>
                                              <Text className={"text-xs text-muted-foreground"}>{i.item.targetPackage.packageName}</Text>
                                          </View>
                                      </View>
                                  </Link>

                                  <View className={"flex flex-row items-center gap-2"}>
                                      <TouchableOpacity
                                          onPress={async () => handleStatusPress(i.item.id, i.item.status === AlertStatus.ACTIVE ? AlertStatus.INACTIVE : AlertStatus.ACTIVE)}
                                          className={"border border-gray-200 p-2 rounded-xl"}>
                                          {i.item.status === AlertStatus.ACTIVE ?
                                              <Pause /> :
                                              <Play />
                                          }
                                      </TouchableOpacity>
                                  </View>
                              </View>

                              <View className={"flex flex-row items-center justify-start gap-2 w-full px-2"}>
                                  {
                                      i.item.status === AlertStatus.ACTIVE ?
                                          <Text className={"text-green-500 font-bold"}>Active</Text> :
                                          <Text className={"text-red-500 font-bold"}>Inactive</Text>
                                  }
                                  <ScrollView horizontal={true}>
                                      {
                                          i.item.triggers.map((trigger: any, index: number) => {
                                              return (
                                                  <Text key={index} className={"text-xs text-muted-foreground border border-gray-200 px-2 mx-1.5 rounded-xl"}>
                                                      {trigger}
                                                  </Text>
                                              )
                                          })
                                      }
                                  </ScrollView>

                              </View>

                          </View>
                      )
                  }}
                  keyExtractor={item => item.id}
              /> :
              <View className={"flex flex-col items-center justify-center h-[90vh]"}>
                  <Text className={"text-2xl font-bold text-center"}>No alerts</Text>
              </View>

          }

          <Link href="/select-package" className={" absolute bottom-4 right-4 bg-white border border-muted border-dashed z-50 rounded-full p-4 shadow-2xl"}>
              <Text className={"text-black font-bold text-xl"}> + Create Alert</Text>
          </Link>

      </View>
  );
}
