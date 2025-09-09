import AppDetail from "@/types/storage/AppDetailType";

type StorageItemType = {
    id: string;
    targetPackage: AppDetail;
    triggers: string[];
    webhook_url: string;
}

export default StorageItemType;