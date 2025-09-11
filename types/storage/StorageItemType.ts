import AppDetail from "@/types/storage/AppDetailType";
import {AlertStatus} from "@/types/AlertStatus";
import WebhookType from "@/types/storage/WebhookType";

type StorageItemType = {
    id: string;
    status: AlertStatus;
    targetPackage: AppDetail;
    triggers: string[];
    webhook: WebhookType;
}

export default StorageItemType;