import { NotificationService } from './../../service/notification.service';
import { DirectoryService } from './../../service/directory.service';
import { MySQLService } from './../../service/my-sql.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.css']
})
export class AccountBalanceComponent implements OnInit {
  postedOn: string;
  selectedAccount: number;
  balance: number;

  data: Array<any> = [];

  constructor(
    private mysql: MySQLService,
    private notice: NotificationService,
    public directory: DirectoryService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.postedOn = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.get();
    this.reset();
  }

  get() {
    this.mysql.select('balance', {
      andWhere: {
        postedOn: this.postedOn
      }
    }).subscribe((res: any) => {
      this.data = [];
      Array.from(res).forEach((item: any) => {
        this.data.push({
          postedOn: new Date(item.postedOn),
          account_id: +item.account_id,
          accountName: this.directory.get(+item.account_id).name,
          openingBalance: +item.openingBalance
        });
      });
    });
  }

  save() {

    const filteredAccount = this.data.find( x => +x.account_id === +this.selectedAccount );
    console.log( filteredAccount );
    if (filteredAccount !== undefined ) {
      this.mysql.update('balance', {
        andWhere: {
          postedOn: this.postedOn,
          account_id: this.selectedAccount,
        },
        userData: {
          openingBalance: this.balance
        }
      }, true).subscribe((res: any) => {
        console.log(res);
        this.notice.changeMessage({
          text: `Updated Opening Balance of
            ${this.directory.get(this.selectedAccount).name} at ${this.postedOn} is = ${filteredAccount.openingBalance}`,
          state: 'green'
        });
        this.get();
        this.reset();
      });
    } else {
      this.mysql.insert('balance', {
        userData: {
          postedOn: this.postedOn,
          account_id: this.selectedAccount,
          openingBalance: this.balance
        }
      }, true).subscribe((res: any) => {
        console.log(res);
        this.notice.changeMessage({
          text: `SET Opening Balance ${this.postedOn} - ${this.directory.get(this.selectedAccount).name} = ${this.balance}`,
          state: 'green'
        });
        this.get();
        this.reset();
      });
    }

  }

  reset() {
    this.balance = 0;
    this.selectedAccount = this.directory.getAccounts()[0].id;
  }

}
