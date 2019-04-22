export interface ProductTransaction {
    id?: number;
    postedOn?: Date;
    product_id: number;
    quantity: number;
    amount: number;
    productName?: string;
}
