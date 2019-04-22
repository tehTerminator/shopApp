import { User } from './../class/user';
export interface Task {
    id?: number;
    customerName: string;
    category_id: number;
    categoryName?: string;
    insertedAt?: Date;
    insertedBy: number;
    insertedByUser?: User;
    acceptedBy?: number;
    acceptedByUser?: User;
    completedAt?: any;
    amountCollected: number;
    status: string;
    comment?: string;
}
