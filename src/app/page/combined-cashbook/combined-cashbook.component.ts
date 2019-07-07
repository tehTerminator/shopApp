import { Component, OnInit } from '@angular/core';
import { MySQLService } from './../../service/my-sql.service';
import { DirectoryService } from './../../service/directory.service';
import { CashTransaction } from './../../interface/cash-transaction';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'app-combined-cashbook',
  templateUrl: './combined-cashbook.component.html',
  styleUrls: ['./combined-cashbook.component.css']
})
export class CombinedCashbookComponent implements OnInit {
  postedOn: Date = new Date();
  transactions: Array<CashTransaction> = [];

  constructor(
    private mysql: MySQLService, 
    private userService: UserService, 
    public directory: DirectoryService
    ) { }

  ngOnInit() { }

  get() {
    this.transactions = [];
    this.mysql.select('cashbook', {
      andWhere: {
        'DATE(postedOn)': this.postedOn,
      }
    }, true).subscribe((res: any) => {
      console.log(res);
      Array.from(res.rows).forEach((item: CashTransaction) => {
        item.giver = this.directory.get(+item.giver_id).name;
        item.receiver = this.directory.get(+item.receiver_id).name;
        item.userName = this.userService.get(item.insertedBy).name;
        this.transactions.push(item);
      });
    });
  }

  approveAll(): void{
    this.mysql.update('cashbook', {
      andWhere: {
        state: "PENDING",
        "DATE(postedOn)" : this.postedOn
      },
      userData: {
        state: "COMPLETED"
      },
      orderBy: 'postedOn ASC'
    }).subscribe(()=>{
      this.transactions.forEach((item: CashTransaction)=>{
        if( item.state === "PENDING"){
          item.state = "COMPLETED";
        }
      });
    });
  }

  approve(entry: CashTransaction){
    this.mysql.update('cashbook', {
      andWhere: {
        id: entry.id
      },
      userData: {
        state: "COMPLETED"
      }
    }).subscribe(()=>{
      entry.state = "COMPLETED";
    });
  }

  reject(t: CashTransaction): void{
    this.mysql.update('cashbook', {
      andWhere: {
        id: t.id
      },
      userData: {
        state: "REJECTED"
      }
    }).subscribe(()=>{
      t.state = "REJECTED";
    });
  }
}
