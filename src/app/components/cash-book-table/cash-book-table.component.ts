import { MySQLService } from './../../service/my-sql.service';
import { UserService } from './../../service/user.service';
import { CashTransaction } from './../../interface/cash-transaction';
import { Directory } from 'src/app/interface/directory';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cash-book-table',
  templateUrl: './cash-book-table.component.html',
  styleUrls: ['./cash-book-table.component.css']
})
export class CashBookTableComponent implements OnInit {
  accounts: Array<Directory> = [];
  transactions: Array<CashTransaction> = [];
  postedOn: Date = new Date();

  constructor(private userService: UserService, private mysql: MySQLService) { }

  ngOnInit() {
    this.mysql.select('directory', { andWhere: { type: 'account' } })
      .subscribe((res: Array<Directory>) => { this.accounts = res; });
  }

  get() {
    this.mysql.select('cashbook', {
      andWhere: {
        'DATE(postedOn)': this.postedOn
      }
    }).subscribe((res: Array<CashTransaction>) => {
      this.transactions = [];
      res.forEach((item: CashTransaction) => {
        item.giver = this.getAccountName(item.giver_id);
        item.receiver = this.getAccountName(item.receiver_id);
        item.userName = this.userService.get(item.insertedBy).name;
        this.transactions.push(item);
      });
    });
  }

  private getAccountName(id: number) {
    return this.accounts.find(x => x.id === id).name;
  }
}
