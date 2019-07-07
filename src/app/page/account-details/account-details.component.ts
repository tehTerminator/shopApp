import { DirectoryService } from './../../service/directory.service';
import { MySQLService } from './../../service/my-sql.service';
import { Component, OnInit } from '@angular/core';
import { CashTransaction } from '../../interface/cash-transaction';
import { Directory } from '../../interface/directory';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
  providers: [DatePipe]
})
export class AccountDetailsComponent implements OnInit {
  transactions: Array<CashTransaction> = [];
  selectedAccount: Directory;
  fromDate = '';
  toDate = '';
  singleDay = true;

  constructor(
    private mysql: MySQLService,
    public directory: DirectoryService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    const today = new Date();
    this.fromDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.toDate = this.fromDate;
  }

  toggleRange(): void {
    this.singleDay = !this.singleDay;
  }

  get() {
    if (+this.selectedAccount === 0) {
      return;
    }
    this.mysql.select('balance', {
      andWhere: {
        account_id: this.selectedAccount,
        postedOn: this.fromDate
      }
    }).subscribe((res: any) => {
      this.transactions = [];
      if (res.length >= 1) {
        this.transactions.push({
          id: 0,
          giver_id: 0,
          giver: 'Self',
          receiver_id: +this.selectedAccount,
          receiver: this.directory.get(+this.selectedAccount).name,
          amount: +res[0].openingBalance,
          description: 'Carry Forward From Last Date',
          state: 'COMPLETED',
          insertedBy: 0,
          balance: +res[0].openingBalance,
          postedOn: this.strToDate(this.fromDate)
        });
      } else {
        this.transactions.push({
          id: 0,
          giver_id: 0,
          giver: 'Self',
          receiver_id: 0,
          receiver: 'SELF',
          amount: 0,
          description: 'No Previous Balance',
          state: 'COMPLETED',
          insertedBy: 0,
          balance: 0,
          postedOn: this.strToDate(this.fromDate)
        });
      }
      this.getStatement();
    });
  }

  getClass(t: CashTransaction): string {
    if (+t.receiver_id === +this.selectedAccount) {
      return 'positive';
    } else {
      return 'negative';
    }
  }

  private getStatement(): void {
    const request = {
      andWhere: {
        orWhere: {
          giver_id: this.selectedAccount,
          receiver_id: this.selectedAccount
        },
        andWhere: {}
      },
      orderBy: 'postedOn ASC'
    };

    if (this.singleDay) {
      request.andWhere.andWhere = {
        'DATE(postedOn)': this.fromDate
      };
    } else {
      if (this.fromDate < this.toDate) {
        request.andWhere.andWhere = {
          'DATE(postedOn)': ['BETWEEN', this.fromDate, this.toDate]
        };
      } else {
        alert('From Date should be smaller than to toDate');
        return;
      }
      request.andWhere.andWhere['state'] = ['<>', 'REJECTED'];
    }

    this.mysql.select('cashbook', request).subscribe((res: Array<CashTransaction>) => {
      Array.from(res).forEach((item: CashTransaction) => {
        item.giver = this.directory.get(+item.giver_id).name;
        item.receiver = this.directory.get(+item.receiver_id).name;
        item.balance = 0;
        this.transactions.push(item);
        const currentElement = this.transactions.length - 1;
        const prevElement = this.transactions.length - 2;

        if ((+this.selectedAccount) === (+item.giver_id)) {
          this.transactions[currentElement].balance = (+this.transactions[prevElement].balance) - (+item.amount);
        } else {
          this.transactions[currentElement].balance = (+this.transactions[prevElement].balance) + (+item.amount);
        }
        this.transactions[currentElement].balance = +this.transactions[currentElement].balance.toFixed(2);
      });
    });
  }

  private strToDate(theDate: string): Date{
    if( theDate.length !== 8 ){
      return new Date();
    } else {
      const year = +theDate.substr(0, 4);
      const month = +theDate.substr(4, 2);
      const day = +theDate.substr(6, 2);
      return new Date(year, month, day);
    }
  }
}
