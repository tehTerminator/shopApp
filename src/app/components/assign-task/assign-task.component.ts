import { NotificationService } from './../../service/notification.service';
import { UserService } from './../../service/user.service';
import { DirectoryService } from './../../service/directory.service';
import { MySQLService } from './../../service/my-sql.service';
import { Task } from './../../interface/task';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css']
})
export class AssignTaskComponent implements OnInit {
  taskId: number;
  task: Task;
  selectedUserId: number;
  private slots: Array<any> = [];
  description: string;

  constructor(
    private mysql: MySQLService,
    public directory: DirectoryService,
    public userService: UserService,
    private notice: NotificationService
  ) { }

  ngOnInit() {
    this.task = {
      customerName: '',
      amountCollected: 0,
      category_id: 0,
      state: 'INACTIVE',
      insertedBy: this.userService.currentUser.id,
      comment: ''
    };
    this.selectedUserId = 1;
    this.taskId = 0;
    this.getSlots();
  }

  get() {
    console.log(this.taskId);
    this.mysql.select('task', { andWhere: { id: this.taskId } }, true).subscribe((res: any) => {
      if (res.rows.length >= 1) {
        this.task = res.rows[0];
        this.task.categoryName = this.directory.get(+this.task.category_id).name;
        this.mysql.select('bookings', {
          andWhere: {
            task_id: this.task.id
          }
        }, true).subscribe((res2: any) => {
          console.log(res2);
          if ( res2.rows.length > 0 ) {
            const slot = this.slots.find(x => +x.id === +res2.rows[0].slot_id);
            this.description = ` Slot - ${res2.rows[0].forDate} - ${slot.startTime} to ${slot.endTime}`;
          }
        });
      } else {
        this.taskId = 0;
        this.task = {
          customerName: '',
          amountCollected: 0,
          category_id: 0,
          state: 'INACTIVE',
          insertedBy: this.userService.currentUser.id,
          comment: this.task.comment || ''
        };
      }
    });
  }

  set() {
    const completedstate = ['COMPLETED', 'APPROVED'];
    if (completedstate.find(x => x === this.task.state)) {
      this.notice.changeMessage({ text: 'Task Already Completed, Cannot Assign to other User.', state: 'red' });
    } else {
      this.mysql.update('task', {
        andWhere: {
          id: this.taskId
        },
        userData: {
          acceptedBy: this.selectedUserId
        }
      }).subscribe(() => {
        this.notice.changeMessage({
          text: `Assigned ${this.task.customerName} to ${this.userService.get(+this.selectedUserId).name}`,
          state: 'green'
        });
      });
    }
  }

  private getSlots(): void {
    this.mysql.select('slots').subscribe((res: any) => {
      for (const it of res) {
        this.slots.push({
          id: it.id,
          title: `${it.startTime} - ${it.endTime}`
        });
      }
    });
  }

}
