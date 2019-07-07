import { DirectoryService } from './../../service/directory.service';
import { UserService } from './../../service/user.service';
import { MySQLService } from './../../service/my-sql.service';
import { Component, OnInit } from '@angular/core';
import { CashTransaction } from '../../interface/cash-transaction';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
  providers: [DatePipe]
})
export class AccountDetailsComponent implements OnInit {
  transactions: Array<CashTransaction> = [];
  selectedAccount: number;
  fromDate = '';
  toDate = '';
  singleDay = true;
  authLevel = this.us.currentUser.authLevel;
  trackedAmounts: Array<number> = [];
  checkCommand: string;

  constructor(
    private mysql: MySQLService,
    public directory: DirectoryService,
    private datePipe: DatePipe,
    private us: UserService
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
      const fromDate = this.datePipe.transform( this.strToDate(this.fromDate), 'yyyy-MM-dd');
      request.andWhere.andWhere = {
        'DATE(postedOn)': ['BETWEEN', fromDate, fromDate],
        state: ['<>', 'REJECTED']
      };
    } else {
      if (this.fromDate > this.toDate) {
        alert('From Date should be smaller than to toDate');
        return;
      } else {
        const fromDate = this.datePipe.transform( this.strToDate(this.fromDate), 'yyyy-MM-dd');
        const toDate = this.datePipe.transform( this.strToDate(this.toDate), 'yyyy-MM-dd');
        request.andWhere.andWhere = {
          'DATE(postedOn)': ['BETWEEN', fromDate, toDate],
          state: ['<>', 'REJECTED']
        };
      }
    }

    this.mysql.select('cashbook', request).subscribe((res: Array<CashTransaction>) => {
      Array.from(res).forEach((item: CashTransaction) => {
        item.giver = this.directory.get(+item.giver_id).name;
        item.receiver = this.directory.get(+item.receiver_id).name;
        item.balance = 0;
        item.amount = +item.amount;
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

  delete(transactionId: number): void {
    if ( confirm('Do You Really Want To Delete Transaction #' + transactionId) ) {
      this.mysql.delete('cashbook', {
        andWhere: {
          id: transactionId
        }
      }).subscribe(() => {
        const i = this.transactions.findIndex(x => +x.id === +transactionId);
        this.transactions.splice(i, 1);
      });

      this.mysql.delete('taskcashbook', {
        andWhere: {
          cashbook_id: transactionId
        }
      });
    }
  }

  private strToDate(theDate: string): Date {
    if ( theDate.length !== 8 ) {
      return new Date();
    } else {
      const year = +theDate.substr(0, 4);
      const month = +theDate.substr(4, 2);
      const day = +theDate.substr(6, 2);
      return new Date(year, month - 1, day);
    }
  }

  check(): void {
    let amount = 0;
    let count = 1;
    if ( this.checkCommand.indexOf('x') > 0 ) {
      const parts = this.checkCommand.split('x');
      amount = +parts[0];
      count = +parts[1];
    } else {
        amount = +this.checkCommand;
    }
    let i = 0;
    for ( i = 0; i < count; i++) {
      const t = this.transactions.find(x => (x.amount === amount && !x.match) );
      if ( t !== undefined ) {
        t.match = true;
      } else {
        this.trackedAmounts.push(amount);
      }
    }

  }
}
