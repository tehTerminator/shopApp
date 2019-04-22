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

  selectBatch(theService: Batch): void {
    this.selectedBatch = theService;

    if (this.selectedBatch.doesItCreatesCashbookEntry()) {
      // Store Cashbook Entry for later use
      const entries = this.selectedBatch.getCashBookSettings();
      this.cashTransactions = [];
      entries.forEach((item: any) => {
        this.cashTransactions.push({
          giver_id: +item.giver_id,
          giver: this.directoryService.get(+item.giver_id).name,
          receiver: this.directoryService.get(+item.receiver_id).name,
          receiver_id: +item.receiver_id,
          amount: +item.amount,
          description: '',
          status: 'PENDING',
          insertedBy: this.userService.currentUser.id,
        });
      });
    }

    if (this.selectedBatch.doesItUsesProducts()) {
      // Store Product Usage For Later User
      const entries = this.selectedBatch.getProductSettings();
      this.productTransactions = [];
      entries.forEach((item: any) => {
        this.productTransactions.push({
          product_id: +item.product_id,
          quantity: +item.quantity,
          amount: item.amount !== undefined ? +item.amount : 0,
          productName: this.directoryService.get(+item.product_id).name
        });
      });
    }

    if (this.selectedBatch.doesItCreatesTask()) {
      this.tab = 1;
      this.task.category_id = +this.selectedBatch.getTaskSettings()[0].category_id;
      this.task.amountCollected = +this.selectedBatch.rate;
    } else {
      this.tab = 3;
    }
  }

  /**
   * Used to go Back on Segments
   */
  prevTab() {
    if (this.tab > 0) {
      this.tab--;
    }
  }

  nextTab() {
    const maxTab = 5;
    if (this.tab < maxTab) {
      this.tab++;
    }
  }

  showPreview() {
    if (this.selectedBatch.doesItCreatesTask()) {
      this.tab = 4;
      if (this.selectedBatch.doesItCreatesCashbookEntry()) {
        this.cashTransactions.forEach((item: CashTransaction) => {
          item.description = `Payment for ${this.selectedBatch.title} - ${this.task.customerName}`;
        });
      }
    } else {
      this.tab = 5;
      this.cashTransactions.forEach((item: CashTransaction) => {
        item.description = `Sale of ${this.selectedBatch.title}`;
      });
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
    console.log('saveTask() clicked');
    this.batchService.set(this.task, this.cashTransactions, this.productTransactions);
    this.batchService.save();
    this.reset();
  }

  reset(): void {
    this.task = {
      customerName: '',
      amountCollected: 0,
      category_id: 0,
      status: 'INACTIVE',
      insertedBy: this.userService.currentUser.id,
    };
    this.selectedBatch = new Batch(0, '', 0, {});
    this.tab = 0;
  }
}
