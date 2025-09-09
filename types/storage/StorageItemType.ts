import AppDetail from "@/types/storage/AppDetailType";
import {AlertStatus} from "@/types/AlertStatus";

type StorageItemType = {
    id: string;
    status: AlertStatus;
    targetPackage: AppDetail;
    triggers: string[];
    webhook_url: string;
    payload: string;
}

export default StorageItemType;