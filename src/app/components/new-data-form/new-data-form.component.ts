import { BatchService } from './../../service/batch.service';
import { CashTransaction } from './../../interface/cash-transaction';
import { Task } from './../../interface/task';
import { Batch } from '../../class/batch';
import { MySQLService } from './../../service/my-sql.service';
import { UserService } from './../../service/user.service';
import { Component, OnInit } from '@angular/core';
import { ProductTransaction } from './../../interface/product-transaction';
import { DirectoryService } from '../../service/directory.service';

@Component({
    selector: 'app-new-data-form',
    templateUrl: './new-data-form.component.html',
    styleUrls: ['./new-data-form.component.css']
})
export class NewDataFormComponent implements OnInit {
    batch: Array<Batch> = [];
    cashTransactions: Array<CashTransaction> = [];
    productTransactions: Array<ProductTransaction> = [];
    selectedBatch: Batch;
    task: Task;
    tab = 0;
    searchServiceText = '';
    constructor(
        private userService: UserService,
        private mysql: MySQLService,
        private batchService: BatchService,
        public directoryService: DirectoryService
    ) {
        this.reset();
    }

    ngOnInit() {
        // Load Services
        this.mysql.select('batch').subscribe((res: any) => {
            Array.from(res).forEach((s: any) => {
                this.batch.push(new Batch(s.id, s.title, s.rate, s.settings));
            });
        });
    }

    selectBatch(theBatch: Batch): void {
        this.selectedBatch = theBatch;
        this.extractDetails();
        if (this.selectedBatch.isPrimarily('task')) {
            this.tab = 1;
        } else if (this.selectedBatch.isPrimarily('cashbook')) {
            this.tab = 2;
        } else if (this.selectedBatch.isPrimarily('product')) {
            this.tab = 3;
        } else {
            this.tab = 0;
            alert('Empty Batch');
            this.reset();
        }
    }

    updateGiver(giverId: number, index: number): void {
        this.cashTransactions[index].giver_id = giverId;
        this.cashTransactions[index].giver = this.directoryService.get(giverId).name;
    }

    updateReceiver(receiverId: number, index: number): void {
        this.cashTransactions[index].receiver_id = receiverId;
        this.cashTransactions[index].receiver = this.directoryService.get(receiverId).name;
    }

    private extractDetails(): void {
        let entries = this.selectedBatch.getProductSettings();
        this.productTransactions = [];
        entries.forEach((item: any) => {
            this.productTransactions.push({
                product_id: +item.product_id,
                quantity: +item.quantity,
                amount: item.amount !== undefined ? +item.amount : 0,
                productName: this.directoryService.get(+item.product_id).name
            });
        });

        entries = this.selectedBatch.getCashBookSettings();
        this.cashTransactions = [];
        entries.forEach((item: any) => {
            this.cashTransactions.push({
                giver_id: +item.giver_id,
                giver: this.directoryService.get(+item.giver_id).name,
                receiver: this.directoryService.get(+item.receiver_id).name,
                receiver_id: +item.receiver_id,
                amount: +item.amount,
                description: '',
                state: 'PENDING',
                insertedBy: this.userService.currentUser.id,
            });
        });

        if (this.selectedBatch.doesItCreatesTask()) {
            this.task.category_id = +this.selectedBatch.getTaskSettings()[0].category_id;
            this.task.amountCollected = +this.selectedBatch.rate;
        }
    }

    /**
     * Used to go Back on Segments
     */
    prevTab(): void {
        if (this.tab > 0) {
            this.tab--;
        }
    }

    nextTab(): void {
        const maxTab = 3;
        if (this.tab < maxTab) {
            this.tab++;
        }
    }

    showPreview(): void {
        if (this.selectedBatch.isPrimarily('task')) {
            this.tab = 4;
            if (this.selectedBatch.doesItCreatesCashbookEntry()) {
                this.cashTransactions.forEach((item: CashTransaction) => {
                    item.description = `Payment for ${this.selectedBatch.title} - ${this.task.customerName}`;
                });
                // Inform about Imbalance to User
                // Automatic Adjustment currently not feasible
                if ( this.task.amountCollected !== this.getCashBookTotal() ) {
                    this.tab = 2;
                    const imbalance = this.task.amountCollected - this.getCashBookTotal();
                    alert('Adjust Amount Rs. ' + imbalance);
                }
            }
        } else if (this.selectedBatch.isPrimarily('product')) {
            this.tab = 5;
            this.cashTransactions.forEach((item: CashTransaction) => {
                item.description = `Sale of ${this.selectedBatch.title}`;
            });
        } else if (this.selectedBatch.isPrimarily('cashbook')) {
            this.tab = 6;
            this.cashTransactions.forEach((item: CashTransaction) => {
                item.description += ` ${this.selectedBatch.title}`;
            });
        } else {
            alert('Batch Is Empty');
            this.reset();
        }
    }

    /**
     * This function calls Object.keys function
     * @param theObject any Object whose keys are requred for iteration
     */
    objectKeys(theObject: any): Array<string> {
        return Object.keys(theObject);
    }

    getCashBookTotal(): number {
        let total = 0;
        this.cashTransactions.forEach((item: CashTransaction) => {
            total += +item.amount;
        });
        return total;
    }

    save() {
        this.batchService.set(this.task, this.cashTransactions, this.productTransactions);
        this.batchService.save();
        this.reset();
    }

    reset(): void {
        this.task = {
            customerName: '',
            amountCollected: 0,
            category_id: 0,
            state: 'INACTIVE',
            insertedBy: this.userService.currentUser.id,
        };
        this.selectedBatch = new Batch(0, '', 0, {});
        this.tab = 0;
    }
}
