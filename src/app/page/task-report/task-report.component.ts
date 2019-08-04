import { Component, OnInit } from '@angular/core';
import { Task } from '../../interface/task';
import { MySQLService } from '../../service/my-sql.service';
import { UserService } from '../../service/user.service';
import { DatePipe } from '@angular/common';
import { DirectoryService } from '../../service/directory.service';
import { Directory } from '../../interface/directory';
import { User } from '../../class/user';

@Component({
  selector: 'app-task-report',
  templateUrl: './task-report.component.html',
  styleUrls: ['./task-report.component.css'],
  providers: [DatePipe]
})
export class TaskReportComponent implements OnInit {
  theDate: string;
  searchText: string;
  tasks: Array<Task> = [];
  categoryId = 0;
  userId = 0;
  userWise: any = {};

  constructor(
    private mysql: MySQLService,
    private userService: UserService,
    private datePipe: DatePipe,
    private ds: DirectoryService
  ) { }

  ngOnInit() {
    this.theDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  get(): void {
    let request: any = {
      andWhere: {
        orWhere: {
          'DATE(insertedAt)': this.theDate,
          'DATE(completedAt)': this.theDate
        },
        andWhere: {
          category_id: this.categoryId,
          acceptedBy: this.userId
        }
      }
    };

    if( +this.userId === 0 || this.userId === undefined ){
      delete( request.andWhere.andWhere.acceptedBy );
    }

    if( +this.categoryId === 0 || this.categoryId === undefined ){
      delete( request.andWhere.andWhere.category_id );
    }

    if( Object.keys(request.andWhere.andWhere).length === 0 ){
      delete( request.andWhere.andWhere );
      const newRequest = {
        orWhere : Object.assign({}, request.andWhere.orWhere)
      };
      request = newRequest;
    }

    this.mysql.select('task', request).subscribe((res: Array<Task>) => {
      this.tasks = [];
      for (const task of res) {
        task.categoryName = this.ds.get(task.category_id).name;
        task.id = +task.id;
        if( +task.acceptedBy >= 1 ){
          task.acceptedByUser = this.userService.get(task.acceptedBy);
        } else {
          task.acceptedByUser = new User(0, 'None', 0);
        }
        this.tasks.push(task);
      }
    });
  }

  categories(): Array<Directory> {
    return this.ds.getCategories();
  }

  users(): Array<User> {
    return this.userService.getAll();
  }

}
