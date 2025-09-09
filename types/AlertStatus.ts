export enum AlertStatus {
    ACTIVE= "ACTIVE",
    INACTIVE= "INACTIVE",
}
export const isAlertStatus = (status: string): status is AlertStatus => {
    return Object.values(AlertStatus).includes(status as AlertStatus);
}