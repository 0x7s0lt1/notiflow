export enum StorageKey {
    ALERT_STORAGE = "alert_storage"
}

export const isStorageKey = (key: any): boolean => {
    return Object.values(StorageKey).includes(key);
};