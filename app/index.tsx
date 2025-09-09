import {Text, View, FlatList, Platform, ScrollView} from "react-native";
import {Image} from "expo-image";
import {useEffect, useRef, useState} from "react";
import { InstalledApps } from 'react-native-launcher-kit';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import useAlertStorage from "@/hooks/use-alert-storage";
import {Plus, Trash} from "lucide-react-native";

export default function Index() {

    let storageFetched = useRef<boolean>(false);

    const { storage, fetchStorage, removeAlert, addAlert } = useAlertStorage();
    // const [apps, setApps] = useState<any|null>(null);

    useEffect(() => {

        if(!storageFetched.current){
            storageFetched.current = true;

            (async ()=>{

                try{

                    // if(Platform.OS === "android"){
                    //     const Apps = InstalledApps.getApps();
                    //     console.log(Apps);
                    //     setApps(Apps);
                    // }

                   await fetchStorage();

                }catch (e){
                    console.log(e);
                }

            })();

        }

    },[fetchStorage])

  return (
      <SafeAreaProvider>
          <SafeAreaView className={"flex flex-col items-center justify-center w-full h-full p-4"}>

              <Text>
                  Towerflow webhook calls by listening to apps notifications
              </Text>
              { storage &&

                  <FlatList
                      className={"mt-4 p-2 w-full"}
                      data={storage}
                      renderItem={ (i: any) =>  {
                          return (
                              <View className={"grid grid-cols-4 items-center shadow rounded-md p-4 my-2"}>
                                  <Link href={`/alert/${i.item.id}`} className={"text-2xl font-bold col-span-3"} >
                                      {i.item.targetPackage.label}
                                  </Link>
                                  <View className={"col-span-1 flex flex-col justify-end bg-red-300 p-2 rounded-full items-center"}>
                                      <Trash className={""} onPress={async () => await removeAlert(i.item.id)} />
                                  </View>
                              </View>
                          )
                      }}
                      keyExtractor={item => item.id}
                  />

              }

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

              <Link href="/create-alert" className={"bg-black text-white border border-muted border-dashed absolute bottom-16 right-4 z-50 rounded-full p-4 shadow-2xl"}>
                  <Plus size={50} color="white" className={"text-white"} />
              </Link>


          </SafeAreaView>
      </SafeAreaProvider>
  );
}
