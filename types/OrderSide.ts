export enum OrderSide {
    BUY = "BUY",
    SELL = "SELL"
}

export const isOrderSide = (value: string): value is OrderSide => {
    return Object.values(OrderSide).includes(value as OrderSide);
}