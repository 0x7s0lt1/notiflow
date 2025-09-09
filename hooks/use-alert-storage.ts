import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageKey} from "@/types/storage/StorageKey";
import InitialStorage from "@/types/storage/InitialStorage";
import {useState} from "react";
import StorageItemType from "@/types/storage/StorageItemType";

const useAlertStorage = () => {

    const [storage, setStorage] = useState<StorageItemType[]>(InitialStorage);

    const fetchStorage = async () => {
        const aStore = await AsyncStorage.getItem(StorageKey.ALERT_STORAGE);

        if(!aStore){
            await AsyncStorage.setItem(StorageKey.ALERT_STORAGE, JSON.stringify(storage));
        }else{
            setStorage(JSON.parse(aStore) as StorageItemType[]);
        }

    }

    const updateStorage = async (data: StorageItemType[]) => {
        await AsyncStorage.setItem(StorageKey.ALERT_STORAGE, JSON.stringify(data));
        setStorage(data);
    }

    const addAlert = async (alert: StorageItemType) => {
        const newStorage = [...storage, alert];
        await updateStorage(newStorage);
    }

    const removeAlert = async (id: string) => {
        const newStorage = storage.filter((a) => a.id !== id);
        await updateStorage(newStorage);
    }

    const clearStorage = async () => {
        await AsyncStorage.removeItem(StorageKey.ALERT_STORAGE);
        setStorage([]);
    }

    return {storage, fetchStorage, updateStorage, addAlert, removeAlert, clearStorage};

}

export default useAlertStorage;
