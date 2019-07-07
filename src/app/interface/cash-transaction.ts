export interface CashTransaction {
    id?: number;
    giver_id: number;
    receiver_id: number;
    amount: number;
    description: string;
    state: string;
    insertedBy: number;
    postedOn?: Date;
    giver?: string;
    receiver?: string;
    userName?: string;
    balance?: number;
    match?: boolean;
}
