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
      status: 'INACTIVE',
      insertedBy: this.userService.currentUser.id,
    };
    this.selectedUserId = 1;
  }

  get() {
    console.log(this.taskId);
    this.mysql.select('task', { andWhere: { id: this.taskId } }, true).subscribe((res: any) => {
      console.log(res);
      this.task = res.rows[0];
      this.task.categoryName = this.directory.get(+this.task.category_id).name;
    });
  }

  set() {
    const completedStatus = ['COMPLETED', 'APPROVED'];
    if (completedStatus.find(x => x === this.task.status)) {
      this.notice.changeMessage({ text: 'Task Already Completed', status: 'red' });
    } else {
      this.mysql.update('task', {
        andWhere: {
          id: this.taskId
        },
        userData: {
          acceptedBy: this.selectedUserId
        }
      }).subscribe(() => {
        console.log(this.selectedUserId, this.userService, this.userService.get(+this.selectedUserId));
        this.notice.changeMessage({
          text: `Assigned ${this.task.customerName} to ${this.userService.get(+this.selectedUserId).name}`,
          status: 'green'
        });
      });
    }
  }

}
