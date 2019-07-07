import { DirectoryService } from './../../service/directory.service';
import { Directory } from './../../interface/directory';
import { UserService } from './../../service/user.service';
import { MySQLService } from './../../service/my-sql.service';
import { Component, OnInit } from '@angular/core';
import { Task } from '../../interface/task';
import { User } from '../../class/user';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})
export class LiveViewComponent implements OnInit {
  tasks: Array<Task> = [];
  selectedDirectory: Directory;
  constructor(private mysql: MySQLService, private userService: UserService, public directory: DirectoryService) { }

  ngOnInit() {
	this.mysql.select('task').subscribe((res: Array<Task>) => {
	  Array.from(res).forEach((item: Task) => {
		const task: Task = {
		  id: +item.id,
		  customerName: item.customerName,
		  category_id: +item.category_id,
		  insertedBy: +item.insertedBy,
		  amountCollected: +item.amountCollected,
		  status: item.status,
		  acceptedBy: +item.acceptedBy,
		  completedAt: new Date(item.completedAt),
		  insertedByUser: this.userService.get(+item.insertedBy),
		};
		if (+item.acceptedBy > 0) {
		  task.acceptedByUser = this.userService.get(+item.acceptedBy);
		} else {
		  task.acceptedByUser = new User(0, '', 0);
		}
		this.tasks.push(task);
	  });
	});
  }

  getColor(theTask: Task): string{
    const status = theTask.status.toLowerCase();
    if( status === 'rejected' ){
        return 'inverted';
    } else if( status === 'unpaid' ){
        return 'teal';
    } else if( status === 'inactive' ){
        if( theTask.acceptedBy > 0 ){
            return 'orange';
        }
    } else if( status === 'active' ){
        return 'red';
    } else if( status === 'completed' ){
        return 'green';
    } else if( status === 'blue' ){
        return 'blue';
    } else {
        return '';
    }
  }

}
