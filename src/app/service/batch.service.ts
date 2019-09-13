import { ProductTransaction } from './../interface/product-transaction';
import { Task } from './../interface/task';
import { Injectable, ɵConsole } from '@angular/core';
import { MySQLService } from './my-sql.service';
import { CashTransaction } from '../interface/cash-transaction';
import { NotificationService } from './notification.service';
import { DirectoryService } from './directory.service';

@Injectable({
  providedIn: 'root',
})
export class BatchService {
  task: Task;
  productTran: Array<ProductTransaction> = [];
  cashTran: Array<CashTransaction> = [];
  private cashbookSaved = false;
  private taskInserted = false;
  private productInserted = false;
  private slotId: number;
  private slotDate: string;
  private slotTitle: string;

  constructor(
    private mysql: MySQLService,
    private notice: NotificationService,
    private ds: DirectoryService) {
    this.task = {
      customerName: '',
      insertedBy: 0,
      amountCollected: 0,
      state: 'INACTIVE',
      category_id: 0
    };
  }

  public set(theTask: Task, cashT: Array<CashTransaction>, prodT: Array<ProductTransaction>): void {
    this.task = theTask;
    this.cashTran = cashT;
    this.productTran = prodT;
    this.cashbookSaved = false;
    this.taskInserted = false;
    this.productInserted = false;
  }

  public setSlot(id: number, date: string, title: string): void {
    this.slotId = id;
    this.slotDate = date;
    this.slotTitle = title;
  }

  public save(): void {
    this.equalizeCashBook();
    this.saveTask();
    this.saveProducts();

    if ( this.task.category_id === 0 && this.productTran.length === 0 ) {
      this.saveCashBookEntry(true);
    }
  }

  /**
   * Saves Task Details
   */
  private saveTask(): void {
    console.log(this.task);
    const customer = this.task.customerName;
    if ( this.task.category_id === 0 ) {
      return;
    }

    if ( this.taskInserted ) {
      return;
    }

    delete (this.task.id);
    if (this.task.state === 'COMPLETED') {
      this.task.acceptedBy = this.task.insertedBy;
      this.task.completedAt = this.toMySqlDateFormat(new Date());
    }

    if (this.task.customerName.length === 0) {
      this.notice.changeMessage({ text: 'Customer Name too Short', state: 'red' });
      return;
    }

    this.mysql.insert('task', {
      userData: this.task
    }, true).subscribe((res: any) => {
      this.task.id = res.lastInsertId;
      this.saveProducts();
      if (this.task.amountCollected > 0) {
        this.saveCashBookEntry(false);
      }
      console.log(this.slotId);
      if ( this.task.id > 0 && this.slotId > 0 ) {
        this.mysql.insert('bookings', {
          userData: {
            task_id: this.task.id,
            slot_Id: this.slotId,
            forDate: this.slotDate,
          }
        }).subscribe(() => {
          const message = `Booked ${customer} for ${this.slotDate} ${this.slotTitle}`;
          this.notice.changeMessage({id: this.task.id, text: message, status: 'green'});
        });
        this.slotId = -1;
      } else {
        const message = `${customer}. Inserted successfully`;
        this.notice.changeMessage({ id: this.task.id, text: message, state: 'green' });
      }
    });
    this.taskInserted = true;
  }

  /**
   * Saves the Product Transaction
   */
  private saveProducts(): void {
    if ( this.productInserted ) {
      return;
    }

    if (this.areTransactionEmpty(this.productTran)) {
      return;
    } else {
      this.productInserted = true;
      Array.from(this.productTran).forEach((item: ProductTransaction) => {
        const message = `Inserted ${item.productName} for Rs.${item.amount}`;
        delete (item.id);
        delete (item.productName);
        delete (item.amount);
        if (item.quantity > 0) {
          this.mysql.insert('productUsage', {
            userData: item
          }).subscribe(() => {
            this.notice.changeMessage({
              text: message,
              state: 'green'
            });
          });
        }
      });
      this.saveCashBookEntry(false);
    }
  }

  /**
   * This Method Equalises Product Transaction Amount And Sales Amount
   * If there is any other Cashbook Transaction Involved then also amount is calculated.
   */
  private equalizeCashBook(): void {
    if (this.productTran.length === 0) {
      return;
    }

    if (this.getTotal(this.productTran) < this.getTotal(this.cashTran)) {
      this.setSalesAmount(this.getTotal(this.productTran));
    } else {
      this.setSalesAmount(this.getTotal(this.productTran) - this.getAmountExceptSales());
    }

  }

  private getAmountExceptSales(): number {
    const salesId = this.ds.find('sales').id;
    const otherTc = this.cashTran.filter(x => +x.giver_id !== +salesId);
    return this.getTotal(otherTc);
  }

  private setSalesAmount(amount: number): void {
    const salesId = this.ds.find('sales').id;
    const salesTrans = this.cashTran.find(x => +x.giver_id === +salesId);
    if (salesTrans !== undefined) {
      salesTrans.amount = amount;
    }
  }


  private areTransactionEmpty(transactionArray: Array<any>): boolean {
    let total = 0;
    Array.from(transactionArray).forEach((item: any) => {
      total += +item.amount;
    });
    return total === 0;
  }

  /**
   * Save Cashbook to Database
   * @param cashbookOnly if batch contains only cashbook Entries
   */
  private saveCashBookEntry(cashbookOnly: boolean): void {
    if (this.cashbookSaved) {
      return;
    }

    if (this.areTransactionEmpty(this.cashTran)) {
      return;
    } else {
      this.cashbookSaved = true;
      Array.from(this.cashTran).forEach((item: CashTransaction) => {
        if (item.amount > 0) {
          delete (item.id);
          delete (item.giver);
          delete (item.receiver);
          delete (item.userName);
          this.mysql.insert('cashbook', { userData: item }, true)
            .subscribe((res: any) => {
              console.log(res);
              item.id = res.lastInsertId;
              this.linkTaskAndCashBook(this.task.id, item.id);
              if (cashbookOnly) {
                this.notice.changeMessage({
                  id: res.lastInsertId,
                  text: `Cashbook Entry Created
                  ${this.ds.get(item.giver_id).name} =>
                  ${this.ds.get(item.receiver_id).name} Rs. ${item.amount}`,
                  state: 'green'
                });
              }
            });
        }
      });
    }
  }

  private linkTaskAndCashBook(taskId: number, cashbookId: number) {
    if (taskId > 0) {
      this.mysql.insert('taskCashbook', {
        userData: {
          task_id: taskId,
          cashbook_id: cashbookId
        }
      }, true).subscribe((res: any) => {
        console.log(res);
      });
    }
  }

  private getTotal(transactionArray: Array<any>): number {
    let total = 0;
    transactionArray.forEach((item: any) => {
      try {
        total += item.amount;
      } catch (e) {
        total += 0;
      }
    });
    return total;
  }

  private toMySqlDateFormat(theDate: Date): string {
    let date = `${theDate.getFullYear()}-${this.pad(theDate.getMonth() + 1, 2)}-${this.pad(theDate.getDate(), 2)} `;
    date += `${this.pad(theDate.getHours(), 2)}:${this.pad(theDate.getMinutes(), 2)}:${this.pad(theDate.getSeconds(), 2)}`;
    return date;
  }

  private pad(num: number, size: number) {
    const s = '000000000' + num;
    return s.substr(s.length - size);
  }

}
