import { Component, OnInit, OnDestroy } from '@angular/core';
import { MySQLService } from './../../service/my-sql.service';
import { DirectoryService } from './../../service/directory.service';
import { UserService } from './../../service/user.service';
import { NotificationService } from './../../service/notification.service';
import { Task } from './../../interface/task';
import { interval } from 'rxjs';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.css']
})
export class MyTaskComponent implements OnInit, OnDestroy {
  assigned: Array<Task> = [];
  theDate: Date = new Date();
  authLevel = 0;
  searchText = '';
  showAll = false;
  private timerSubscription: any;
  slotBased = true;


  constructor(
    private db: MySQLService,
    private directory: DirectoryService,
    private users: UserService,
    private notice: NotificationService
  ) { }

  ngOnInit() {
    this.authLevel = +this.users.currentUser.authLevel;
    this.get();
    const timer = interval(1000 * 60);
    this.timerSubscription = timer.subscribe(() => {
      this.get();
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  get(): void {
    this.assigned = [];
    const request = {
      andWhere: {
        state: ['NOT IN', 'COMPLETED', 'REJECTED', 'APPROVED'],
        acceptedBy: this.users.currentUser.id
      }
    };
    this.db.select('task', request, true).subscribe((res: any) => {
      console.log(res);
      Array.from(res.rows).forEach((item: Task) => {
        const task = {
          id: item.id,
          customerName: item.customerName,
          category_id: item.category_id,
          categoryName: this.directory.get(+item.category_id).name,
          insertedAt: item.insertedAt,
          insertedBy: item.insertedBy,
          insertedByUser: this.users.get(+item.insertedBy),
          acceptedBy: +item.acceptedBy,
          acceptedByUser: +item.acceptedBy > 0 ? this.users.get(+item.acceptedBy) : undefined,
          completedAt: item.completedAt,
          amountCollected: +item.amountCollected,
          state: item.state,
          comment: item.comment
        };
        this.assigned.push(task);
      });
    });
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  unselect(theTask: Task) {
    const index = this.assigned.indexOf(theTask);
    if (index >= 0) {
      theTask.acceptedBy = -1;
      theTask.acceptedByUser = undefined;
      theTask.state = 'INACTIVE';
      this.assigned.splice(index, 1);
      this.db.update('task', {
        userData: {
          acceptedBy: 0,
          state: 'INACTIVE'
        },
        andWhere: {
          id: theTask.id
        }
      }).subscribe(() => {
        this.notice.changeMessage({
          id: theTask.id,
          text: `Unassigned ${theTask.customerName}`,
          state: 'green'
        });
      });
    } else {
      this.notice.changeMessage({
        id: theTask.id,
        text: `Something went wrong with task of ${theTask.customerName}`,
        state: 'red'
      });
    }
  }

  setCompleted(theTask: Task) {
    const index = this.assigned.indexOf(theTask);
    const taskId = theTask.id;
    if (index >= 0) {
      theTask.state = 'COMPLETED';
      this.db.update('task', {
        userData: {
          acceptedBy: this.users.currentUser.id,
          state: 'COMPLETED',
          completedAt: this.getMysqlDate()
        },
        andWhere: {
          id: theTask.id
        }
      }).subscribe(() => {
        this.assigned.splice(index, 1);
        this.notice.changeMessage({
          id: theTask.id,
          text: `Completed ${theTask.categoryName} of ${theTask.customerName}`,
          state: 'green'
        });
        this.updateCashbook(theTask.id, 'COMPLETED');
      });
      this.db.update('bookings', {
        andWhere: {
          task_id: taskId
        },
        userData: {
          completed: 1
        }
      }, true).subscribe((res: any) => {
        console.log(res);
      });
    } else {
      this.notice.changeMessage({
        id: theTask.id,
        text: `Something went wrong with task of ${theTask.customerName}`,
        state: 'red'
      });
    }
  }

  setActive(theTask: Task) {
    this.setstate(theTask, 'ACTIVE');
    theTask.state = 'ACTIVE';
  }

  setInactive(theTask: Task) {
    this.setstate(theTask, 'INACTIVE');
    theTask.state = 'INACTIVE';
  }

  setRejected(theTask: Task) {
    const index = this.assigned.indexOf(theTask);
    this.refundMoney(theTask.id);
    this.setstate(theTask, 'REJECTED');
    theTask.state = 'REJECTED';
    this.assigned.splice(index, 1);
  }

  private refundMoney(taskId: number): void {
    this.db.select('taskcashbook', {
      columns: ['taskcashbook.cashbook_id as id',
        'taskcashbook.task_id',
        'cashbook.receiver_id',
        'cashbook.giver_id',
        'cashbook.amount',
        'cashbook.description',
      ],
      andWhere: {
        task_id: taskId
      },
      join: 'cashbook on cashbook.id = taskcashbook.cashbook_id'
    }, true).subscribe((res: any) => {
      console.log(res);
      Array.from(res.rows).forEach((item: any) => {
        const message = `Refund ${item.description}`;
        this.db.insert('cashbook', {
          userData: {
            giver_id: item.receiver_id,
            receiver_id: item.giver_id,
            amount: item.amount,
            description: `Refund ${item.description}`,
            insertedBy: this.users.currentUser.id,
            state: 'COMPLETED'
          }
        }, true).subscribe((res2: any) => {
          this.notice.changeMessage({
            id: res2.lastInsertId,
            text: message,
            state: 'green'
          })
        });
      });
    });
  }

  private updateCashbook(id: number, thestate: string): void {
    this.db.select('taskcashbook', {
      andWhere: {
        task_id: id
      }
    }).subscribe((res: any) => {
      Array.from(res).forEach((item: any) => {
        this.db.update('cashbook', {
          andWhere: {
            id: item.cashbook_id
          },
          userData: {
            state: thestate
          }
        });
      });
    });
  }

  private setstate(theTask: Task, thestate: string) {
    this.db.update('task', {
      andWhere: {
        id: theTask.id
      },
      userData: {
        state: thestate
      }
    }).subscribe(() => {
      theTask.state = thestate;
    });
  }

  private getMysqlDate(): string {
    let output = '';
    const d = new Date();
    output += `${this.pad(d.getFullYear(), 2)}-${this.pad(d.getMonth() + 1, 2)}-${this.pad(d.getDate(), 2)} `;
    output += `${this.pad(d.getHours(), 2)}:${this.pad(d.getMinutes(), 2)}:${this.pad(d.getSeconds(), 2)}`;
    return output;
  }

  private pad(n: number, width: number): string {
    width -= n.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(n.toString()) ? 2 : 1)).join('0') + n;
    }
    return n + ''; // always return a string
  }

  getColor(theTask: Task): string {
    const state = theTask.state.toLowerCase();
    if (state === 'rejected') {
      return 'inverted';
    } else if (state === 'unpaid') {
      return 'teal';
    } else if (state === 'inactive') {
      if (theTask.acceptedBy > 0) {
        return 'orange';
      }
    } else if (state === 'active') {
      return 'red';
    } else if (state === 'completed') {
      return 'green';
    } else if (state === 'blue') {
      return 'blue';
    } else {
      return '';
    }
  }

}
