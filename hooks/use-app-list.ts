import RNInstalledApplication from 'react-native-installed-application-v2';
import AppDetail from "@/types/storage/AppDetailType";
import {useState} from "react";

const useAppList = () => {

    const [appList, setAppList] = useState<AppDetail[]>([]);
    const [includeSystemApps, setIncludeSystemApps] = useState<boolean>(false);

    const fetchAppList = async (_includeSystemApps: boolean = includeSystemApps) => {

        const apps = _includeSystemApps ?
            await RNInstalledApplication.getApps() :
            await RNInstalledApplication.getNonSystemApps();
        if(apps){
            setAppList(apps as AppDetail[]);
            return apps as AppDetail[];
        }

        return appList;
    };


    return { appList, fetchAppList, includeSystemApps, setIncludeSystemApps }

}

export default useAppList;