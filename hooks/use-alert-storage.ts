import AsyncStorage from "@react-native-async-storage/async-storage";
import {StorageKey} from "@/types/storage/StorageKey";
import {useState} from "react";
import StorageItemType from "@/types/storage/StorageItemType";
import {AlertStatus} from "@/types/AlertStatus";

const useAlertStorage = () => {

    const [storage, setStorage] = useState<StorageItemType[]>([]);

    const fetchStorage = async () => {
        const aStore = await AsyncStorage.getItem(StorageKey.ALERT_STORAGE);

        if(!aStore){
            await AsyncStorage.setItem(StorageKey.ALERT_STORAGE, JSON.stringify(storage));

            return [];
        }else{
            const parsedStorage = JSON.parse(aStore) as StorageItemType[];
            setStorage(parsedStorage);

            return parsedStorage;
        }

    }

    const updateStorage = async (data: StorageItemType[]) => {
        await AsyncStorage.setItem(StorageKey.ALERT_STORAGE, JSON.stringify(data));
        setStorage(
            JSON.parse( await AsyncStorage.getItem(StorageKey.ALERT_STORAGE) ?? "[]")
        );
    }

    const addAlert = async (alert: StorageItemType) => {
        const newStorage = [
            ...JSON.parse( await AsyncStorage.getItem(StorageKey.ALERT_STORAGE) ?? "[]"),
            alert
        ];
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

    const setStatus = async (id: string, status: AlertStatus) => {
        const newStorage = storage.map((a) => a.id === id ? {...a, status} : a);
        await updateStorage(newStorage);
    }

    const replaceAlert = async (id: string, alert: StorageItemType) => {
        const newStorage = storage.map((a) => a.id === id ? alert : a);
        await updateStorage(newStorage);
    }

    return {storage, setStatus, fetchStorage, updateStorage, addAlert, removeAlert, clearStorage, replaceAlert};

}

export default useAlertStorage;
