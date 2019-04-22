import { DirectoryService } from './../../service/directory.service';
import { MySQLService } from './../../service/my-sql.service';
import { Component, OnInit } from '@angular/core';
import { CashTransaction } from '../../interface/cash-transaction';
import { Directory } from '../../interface/directory';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  transactions: Array<CashTransaction> = [];
  selectedAccount: Directory;
  theDate: Date = new Date();

  constructor(private mysql: MySQLService, public directory: DirectoryService) { }

  ngOnInit() { }

  get() {
    if (+this.selectedAccount === 0) {
      return;
    }

    console.log(this.selectedAccount);

    const request = {
      andWhere: {
        orWhere: {
          giver_id: this.selectedAccount,
          receiver_id: this.selectedAccount
        },
        andWhere: {
          'DATE(postedOn)': this.theDate
        }
      }
    };

    console.log(request)
    this.mysql.select('cashbook', request).subscribe((res: any) => {
      this.transactions = [];
      Array.from(res).forEach((item: CashTransaction) => {
        console.log(item);
        this.transactions.push({
          id: +item.id,
          giver_id: +item.giver_id,
          giver: this.directory.get(+item.giver_id).name,
          receiver_id: +item.receiver_id,
          receiver: this.directory.get(+item.receiver_id).name,
          amount: +item.amount,
          description: item.description,
          status: item.status,
          insertedBy: item.insertedBy,
          balance: 0
        });
      });
    });
  }

  getClass(t: CashTransaction): string {
    if (+t.receiver_id === +this.selectedAccount) {
      return 'positive';
    } else {
      return 'negative';
    }
  }

}
