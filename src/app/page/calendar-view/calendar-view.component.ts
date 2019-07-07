import { Component, OnInit } from '@angular/core';
import { MySQLService } from './../../service/my-sql.service';
import { DirectoryService } from './../../service/directory.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  providers: [DatePipe]
})
export class CalendarViewComponent implements OnInit {
  month: string;
  year: string;
  theMonth: string;
  selectedAccount: number;
  data: any = {};

  constructor(
    private db: MySQLService,
    private datePipe: DatePipe,
    public directory: DirectoryService
  ) { }

  ngOnInit() {
  }

  calcDates(): void {
    const yearMonth = this.theMonth.split('-');
    this.year = yearMonth[0];
    this.month = yearMonth[1];
  }

  getNextDate(theDate: string): string {
    const splitedDate = theDate.split('-');
    const nextDate = new Date(+splitedDate[0], +splitedDate[1] - 1, +splitedDate[2]);
    nextDate.setDate(nextDate.getDate() + 1);
    const result = this.datePipe.transform(nextDate, 'yyyy-MM-dd');
    return result;
  }

  getPreviousDate(theDate: string): string {
    const splitedDate = theDate.split('-');
    const prevDate = new Date(+splitedDate[0], +splitedDate[1] - 1, +splitedDate[2]);
    prevDate.setDate(prevDate.getDate() - 1);
    const result = this.datePipe.transform(prevDate, 'yyyy-MM-dd');
    return result;
  }

  get(): void {
    this.data = {};
    this.calcDates();
    this.getBalance();
  }

  getBalance(): void {
    this.db.select('balance', {
      andWhere: {
        'MONTH(postedOn)': this.month,
        'YEAR(postedOn)': this.year,
        account_id: this.selectedAccount
      },
      orderBy: 'balance.postedOn ASC'
    }, true).subscribe((res: any) => {
      console.log(res.query);
      Array.from(res.rows).forEach((item: any) => {
        const postedOn = String(item.postedOn);
        this.data[postedOn] = {
          openingBalance: +item.openingBalance,
          credit: 0,
          debit: 0,
          actualCB: 0,
          computedCB: 0
        };
      });
      this.updateClosingBalance();
      console.table(this.data);
      this.getEntriesFromCashbook();
    });
  }

  private updateClosingBalance(): void {
    Array.from(this.objectKeys(this.data)).forEach((item: string) => {
      const currentDate = item;
      const nextDate = this.getNextDate(currentDate);
      if ( this.data[nextDate] !== undefined ) {
        this.data[currentDate].actualCB = this.data[nextDate].openingBalance;
      }
    });
  }

  getEntriesFromCashbook(): void {
    this.db.select('cashbook', {
      columns: ['SUM(amount) as amount', 'giver_id', 'receiver_id', 'DATE(postedOn) as postedOn'],
      andWhere: {
        andWhere: {
          'MONTH(postedOn)': this.month,
          'YEAR(postedOn)': this.year,
        },
        orWhere: {
          giver_id: this.selectedAccount,
          receiver_id: this.selectedAccount
        }
      },
      groupBy: 'postedOn, giver_id'
    }, true).subscribe((res: any) => {
      Array.from(res.rows).forEach((item: any) => {
        this.computeRow(item);
      });
    });
  }

  private computeRow(row: any): void {
    const postedOn = String(row.postedOn);
    if ( this.data[postedOn] === undefined ) {
      // Create Row in Data if Row Does Not Exist
      this.data[postedOn] = {
        openingBalance: 0,
        credit: 0,
        debit: 0,
        computedCB: 0,
        actualCB: 0
      };
    }

    // Select Element
    const element = this.data[postedOn];

    if ( +row.giver_id === +this.selectedAccount ) {
      element.credit += (+row.amount);
    } else {
      element.debit += (+row.amount);
    }

    // Change Closing Balance
    element.computedCB = (element.openingBalance - element.credit + element.debit).toFixed(2);
  }

  getClosingBalance(theDate: string): number {
    const nextDate = this.getNextDate(theDate);
    // console.log(theDate, nextDate);
    if (this.data[nextDate] === undefined) {
      return 0;
    } else {
      // console.log( theDate, nextDate, this.data[nextDate].openingBalance);
      return +this.data[nextDate].openingBalance;
    }
  }

  objectKeys(theObject: any): Array<string> {
    let result = Object.keys(theObject);
    result = result.sort((firstDate: string, secondDate: string) => {
      const dayOne = +firstDate.split('-')[2];
      const dayTwo = +secondDate.split('-')[2];
      return dayOne - dayTwo;
    });
    return result;
  }
}
