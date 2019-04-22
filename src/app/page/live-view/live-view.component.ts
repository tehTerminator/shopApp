import { Directory } from './../../interface/directory';
import { DirectoryArray } from './../../class/directory-array';
import { UserService } from './../../service/user.service';
import { MySQLService } from './../../service/my-sql.service';
import { Component, OnInit } from '@angular/core';
import { Task } from '../../interface/task';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})
export class LiveViewComponent implements OnInit {
  tasks: Array<Task> = [];
  directory: DirectoryArray = new DirectoryArray();
  selectedDirectory: Directory;
  constructor(private mysql: MySQLService, private userService: UserService) { }

  ngOnInit() {
    this.mysql.select('directory').subscribe((res: any) => this.directory.set(res));
    this.mysql.select('task').subscribe((res: Array<Task>) => {
      Array.from(res).forEach((item: Task) => {
        this.tasks.push({
          id: +item.id,
          customerName: item.customerName,
          category_id: +item.category_id,
          insertedBy: +item.insertedBy,
          insertedByUser: this.userService.get(+item.insertedBy),
          amountCollected: +item.amountCollected,
          status: item.status,
          acceptedBy: +item.acceptedBy,
          acceptedByUser: this.userService.get(+item.acceptedBy),
          completedAt: new Date(item.completedAt)
        });
      });
    });
  }

}
