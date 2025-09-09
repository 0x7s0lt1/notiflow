import {Text, View, FlatList, Platform, ScrollView, Alert} from "react-native";
import {useEffect, useRef, useState} from "react";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import useAlertStorage from "@/hooks/use-alert-storage";
import {Plus, Trash} from "lucide-react-native";

export default function Index() {

    let storageFetched = useRef<boolean>(false);

    const { storage, fetchStorage, removeAlert } = useAlertStorage();

    const handleRemovePress = async (id: string) => {

        Alert.alert("Remove Alert", "Are you sure you want to remove this alert?",
            [
                {
                    text: "Cancel"
                },
                {
                    text: "Remove",
                    onPress: async () => await removeAlert(id)
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
                              <View className={"grid grid-cols-4 items-center border border-muted shadow rounded-md p-4 my-2"}>
                                  <Link href={`/alert/${i.item.id}`} className={"col-span-3 text-2xl font-bold"} >
                                      {i.item.targetPackage.label}
                                  </Link>
                                  <View className={"col-span-1 flex flex-col justify-end bg-red-300 p-2 rounded-full items-center"}>
                                      <Trash className={""} onPress={async () => handleRemovePress(i.item.id)} />
                                  </View>
                              </View>
                          )
                      }}
                      keyExtractor={item => item.id}
                  />

              }


              <Link href="/create-alert" className={"bg-black text-white border border-muted border-dashed absolute bottom-16 right-4 z-50 rounded-full p-4 shadow-2xl"}>
                  <Plus size={50} color="white" className={"text-white"} />
              </Link>


          </SafeAreaView>
      </SafeAreaProvider>
  );
}
