import { Directory } from './../../interface/directory';
import { UserService } from './../../service/user.service';
import { MySQLService } from './../../service/my-sql.service';
import { CashTransaction } from './../../interface/cash-transaction';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-cash-book-form',
  templateUrl: './cash-book-form.component.html',
  styleUrls: ['./cash-book-form.component.css']
})
export class CashBookFormComponent implements OnInit {
  transaction: CashTransaction;
  accounts: Array<Directory> = [];
  constructor(
    private mysql: MySQLService,
    private userService: UserService,
    private notification: NotificationService
  ) {
    this.reset();
  }

  ngOnInit() {
    this.mysql.select('directory', {
      andWhere: { type: 'account' }
    }).subscribe((response: any) => {
      response.forEach((account: any) => {
        this.accounts.push({
          id: +account.id,
          name: account.name,
          type: account.type
        });
      });
    });
  }

  reset() {
    this.transaction = {
      id: 0,
      giver_id: 0,
      receiver_id: 0,
      amount: 0,
      description: '',
      insertedBy: this.userService.currentUser.id,
      postedOn: new Date(),
      status: this.userService.currentUser.authLevel > 5 ? 'COMPLETED' : 'PENDING'
    };
  }

  save() {
    const request = {
      userData: Object.assign({}, this.transaction),
      andWhere: { id: this.transaction.id }
    };
    delete (request.userData.id);
    delete (request.userData.postedOn);
    const giver = this.accounts.find(x => x.id === +this.transaction.giver_id).name;
    const receiver = this.accounts.find(x => x.id === +this.transaction.receiver_id).name;
    const amount = this.transaction.amount;
    let notice = '';

    console.dir(giver, receiver, amount);


    if (this.transaction.id === 0) {
      // Remove Update Request
      delete (request.andWhere);
      this.mysql.insert('cashbook', request, true).subscribe((res: any) => {
        notice = `Successfully inserted to cashook amount Rs. ${amount}. ${giver} to ${receiver}`;
      });
    } else {
      this.mysql.update('cashbook', request, true).subscribe((res: any) => {
        notice = `Successfully update cashbook id ${this.transaction.id} amount Rs. ${amount}. ${giver} to ${receiver}`;
      });
      this.notification.changeMessage({ text: notice, status: 'green' });
    }
    this.reset();
  }

  get() {
    this.mysql.select('cashbook', { andWhere: { id: this.transaction.id } })
      .subscribe((response: any) => {
        if (response.length === 0) {
          this.reset();
        } else {
          const res = response[0];
          this.transaction.giver_id = +res.giver_id;
          this.transaction.receiver_id = +res.receiver_id;
          this.transaction.amount = +res.amount;
          this.transaction.description = res.description;
          this.transaction.postedOn = new Date(res.postedOn);
          this.transaction.insertedBy = +res.insertedBy;
          this.transaction.status = res.status;
        }
      });
  }

}
