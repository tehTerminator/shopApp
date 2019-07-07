import { DirectoryService } from './../../service/directory.service';
import { Directory } from './../../interface/directory';
import { UserService } from './../../service/user.service';
import { MySQLService } from './../../service/my-sql.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../../interface/task';
import { User } from '../../class/user';
import { interval } from 'rxjs';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})
export class LiveViewComponent implements OnInit, OnDestroy {
  tasks: Array<Task> = [];
  theDate: Date = new Date();
  selectedDirectory: Directory;
  private timerSubscription: any;
  selectedCategory: string;
  searchText: string;
  selectedState: string;


  constructor(
    private mysql: MySQLService,
    private userService: UserService,
    public directory: DirectoryService
  ) { }


  ngOnInit() {
    const timer = interval(1000 * 60);
    this.timerSubscription = timer.subscribe(() => {
      this.get();
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log('Timer No More');
    }
  }

  get(): void {
    const request = {
      andWhere: {
        'DATE(insertedAt)': this.theDate,
        state: this.selectedState,
        category_id: this.selectedCategory
      }
    };

    if (this.selectedState === undefined || +this.selectedState.length === 0) {
      delete( request.andWhere.state );
    }

    if (this.selectedCategory === undefined || +this.selectedCategory.length === 0) {
      delete(request.andWhere.category_id);
    }

    this.mysql.select('task', request).subscribe((res: any) => {
      this.tasks = [];
      Array.from(res).forEach((item: Task) => {
        item.categoryName = this.directory.get(item.category_id).name;
        this.pushItem(item);
      });
    });
  }

  getColor(theTask: Task): string {
    const state = theTask.state.toLowerCase();
    if (state === 'rejected') {
      return 'basic red';
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

  private pushItem(item: any) {
    const task: Task = {
      id: +item.id,
      customerName: item.customerName,
      category_id: +item.category_id,
      insertedBy: +item.insertedBy,
      amountCollected: +item.amountCollected,
      state: item.state,
      acceptedBy: +item.acceptedBy,
      completedAt: new Date(item.completedAt),
      insertedByUser: this.userService.get(+item.insertedBy),
      categoryName: item.categoryName,
      insertedAt: item.insertedAt
    };
    if (+item.acceptedBy > 0) {
      task.acceptedByUser = this.userService.get(+item.acceptedBy);
    } else {
      task.acceptedByUser = new User(0, '', 0);
    }
    this.tasks.push(task);
  }
}
