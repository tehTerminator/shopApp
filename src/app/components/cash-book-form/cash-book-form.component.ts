import { Component } from '@angular/core';
import { UserService } from './../../service/user.service';
import { MySQLService } from './../../service/my-sql.service';
import { CashTransaction } from './../../interface/cash-transaction';
import { DirectoryService } from './../../service/directory.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-cash-book-form',
  templateUrl: './cash-book-form.component.html',
  styleUrls: ['./cash-book-form.component.css'],
})
export class CashBookFormComponent {
  transaction: CashTransaction;
  theDate: string;
  theTime: string;
  constructor(
    private mysql: MySQLService,
    private userService: UserService,
    private notification: NotificationService,
    public directory: DirectoryService) {
    this.reset();
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
      state:
        this.userService.currentUser.authLevel > 5 ? 'COMPLETED' : 'PENDING'
    };
  }

  save() {
    const keys = Object.keys(this.transaction);
    const request = {
      userData: {},
      andWhere: { id: this.transaction.id }
    };

    // Cant Copy Array with Object.assign so Iterating  through all the keys one by one
    keys.forEach((item: string) => {
      if (item !== 'id' && item !== 'postedOn') {
        request.userData[item] = this.transaction[item];
      } else if (item === 'postedOn' && this.transaction.id > 0) {
        // Create Date from datetime-local field
        request.userData[item] = this.getDateTime();
        console.log(request);
      }
    });

    const giver = this.directory.get(+this.transaction.giver_id).name;
    const receiver = this.directory.get(+this.transaction.receiver_id).name;
    const amount = this.transaction.amount;

    if (this.transaction.id === 0) {
      // Remove Update Request
      delete request.andWhere;
      this.mysql.insert('cashbook', request, true).subscribe((res: any) => {
        const notice = `Successfully inserted to cashook amount Rs. ${amount}. ${giver} to ${receiver}`;
        this.notification.changeMessage({ id: res.lastInsertId, text: notice, state: 'green' });
      });
    } else {
      const transId = this.transaction.id;
      this.mysql.update('cashbook', request).subscribe(() => {
        const notice = `Successfully updated cashbook amount Rs. ${amount}. ${giver} to ${receiver}`;
        this.notification.changeMessage({ id: transId, text: notice, state: 'green' });
      });
    }
    this.reset();
  }

  get() {
    this.mysql
      .select('cashbook', { andWhere: { id: this.transaction.id } })
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
          this.transaction.state = res.state;
          this.theDate = res.postedOn.split(' ')[0];
          this.theTime = res.postedOn.split(' ')[1];
        }
      });
  }

  private getDate(): string {
    let theDate = this.theDate.substr(0, 4) + '-';
    theDate += this.theDate.substr(4, 2) + '-';
    theDate += this.theDate.substr(6, 2);
    return theDate;
  }

  private getTime(): string {
    let theTime = this.theTime.substr(0, 2) + ':';
    theTime += this.theTime.substr(2, 2) + ':';
    theTime += this.theTime.substr(4, 2);
    return theTime;
  }

  private getDateTime(): string {
    return `${this.getDate()} ${this.getTime()}`;
  }

  delete(): void {
    if (confirm('Do You really Want to Delete transaction #' + this.transaction.id)) {
      this.mysql.update('cashbook', {
        userData: {
          state: 'REJECTED'
        },
        andWhere: {
          id: this.transaction.id
        }
      }).subscribe(() => {
        this.notification.changeMessage({id: this.transaction.id, text: `Deleted Transaction #${this.transaction.id}`, status:'green'});
        this.reset();
      });
    }
  }

}
