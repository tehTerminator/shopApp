import { Component, OnInit } from '@angular/core';
import { MySQLService } from './../../service/my-sql.service';
import { DirectoryService } from './../../service/directory.service';
import { UserService } from './../../service/user.service';
import { NotificationService } from './../../service/notification.service';
import { Task } from './../../interface/task';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.css']
})
export class MyTaskComponent implements OnInit {
  assigned: Array<Task> = [];
  unassigned: Array<Task> = [];
  theDate: Date = new Date();
  searchText = "";

  constructor(
    private db: MySQLService,
    private directory: DirectoryService,
    private users: UserService,
    private notice: NotificationService
  ) { }

  ngOnInit() {
    this.getAssigned();
    this.getUnassigned();
  }

  getAssigned(): void {
    this.assigned = [];
    const request = {
      andWhere: {
        status: ['NOT IN', 'COMPLETED', 'REJECTED', 'APPROVED'],
        acceptedBy: this.users.currentUser.id
      }
    };
    this.get(request);
  }

  getUnassigned(): void {
    this.unassigned = [];
    const request = {
      andWhere: {
        status: ['NOT IN', 'COMPLETED', 'REJECTED', 'APPROVED'],
        acceptedBy: 0
      }
    };
    this.get(request);
  }

  assignTask(theTask: Task) {
    const index = this.unassigned.indexOf(theTask);
    if (index >= 0) {
      theTask.acceptedBy = this.users.currentUser.id;
      theTask.acceptedByUser = this.users.currentUser;
      theTask.status = "INACTIVE";

      this.assigned.push(theTask);
      this.unassigned.splice(index, 1);
      this.db.update('task', {
        userData: {
          acceptedBy: this.users.currentUser.id,
          status: 'INACTIVE'
        },
        andWhere: {
          id: theTask.id
        }
      }, true).subscribe(() => {
        this.notice.changeMessage({
          id: theTask.id,
          text: `Assigned ${theTask.customerName} to ${this.users.currentUser.name}`,
          status: 'green'
        });
      });
    } else {
      this.notice.changeMessage({
        id: theTask.id,
        text: `Something went wrong with task of ${theTask.customerName}`,
        status: 'red'
      });
    }
  }

  unassignTask(theTask: Task) {
    const index = this.assigned.indexOf(theTask);
    if (index >= 0) {
      theTask.acceptedBy = -1;
      theTask.acceptedByUser = undefined;
      theTask.status = "INACTIVE";
      this.unassigned.push(theTask);
      this.assigned.splice(index, 1);
      this.db.update('task', {
        userData: {
          acceptedBy: -1,
          status: 'INACTIVE'
        },
        andWhere: {
          id: theTask.id
        }
      }).subscribe(() => {
        this.notice.changeMessage({
          id: theTask.id,
          text: `Unassigned ${theTask.customerName}`,
          status: 'green'
        });
      });
    } else {
      this.notice.changeMessage({
        id: theTask.id,
        text: `Something went wrong with task of ${theTask.customerName}`,
        status: 'red'
      });
    }
  }

  markComplete(theTask: Task) {
    const index = this.assigned.indexOf(theTask);
    if (index >= 0) {
      theTask.status = "COMPLETED";
      this.db.update('task', {
        userData: {
          acceptedBy: this.users.currentUser.id,
          status: "COMPLETED",
          completedAt: this.getMysqlDate()
        },
        andWhere: {
          id: theTask.id
        }
      }).subscribe(()=>{
        this.assigned.splice(index, 1);
        this.notice.changeMessage({
          id: theTask.id,
          text: `Completed ${theTask.categoryName} of ${theTask.customerName}`,
          status: 'green'
        })
      });
    } else {
      this.notice.changeMessage({
        id: theTask.id,
        text: `Something went wrong with task of ${theTask.customerName}`,
        status: 'red'
      });
    }
  }

  private get(request: any): void {
    this.db.select('task', request).subscribe((res: any) => {
      Array.from(res).forEach((item: Task) => {
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
          status: item.status,
          comment: item.comment
        };
        if( task.acceptedBy === 0 ){
          this.unassigned.push(task);
        } else {
          this.assigned.push(task);
        }
      });
    });
  }

  private getMysqlDate(): string{
    let output = '';
    const d = new Date();
    output += `${this.pad(d.getFullYear(), 2)}-${this.pad(d.getMonth() + 1, 2)}-${this.pad(d.getDate(), 2)} `;
    output += `${this.pad(d.getHours(), 2)}:${this.pad(d.getMinutes(), 2)}:${this.pad(d.getSeconds(), 2)}`;
    return output;
  }

  private pad( n: number, width: number ): string{
  width -= n.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( n.toString() ) ? 2 : 1) ).join( '0' ) + n;
  }
  return n + ""; // always return a string
}

}
