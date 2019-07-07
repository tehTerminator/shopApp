import { Component, OnInit, OnDestroy } from '@angular/core';
import { MySQLService } from '../../service/my-sql.service';
import { DirectoryService } from '../../service/directory.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-task-counter',
  templateUrl: './task-counter.component.html',
  styleUrls: ['./task-counter.component.css']
})
export class TaskCounterComponent implements OnInit, OnDestroy {
  data = {};
  private timerSubscription: any;
  constructor(private db: MySQLService, private dir: DirectoryService) { }

  ngOnInit() {
    this.get();
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
    this.data = {};
    this.db.select('task', {
      columns: ['count(id) as count', 'category_id', 'state'],
      andWhere: {
        state: ['<>', 'REJECTED'],
        'DATE(insertedAt)': ['CURDATE()', 'noQuotes']
      },
      groupBy: 'category_id, state'
    }).subscribe((res: any)=>{
      Array.from(res).forEach((item: any) => {
        this.pushData(+item.category_id, +item.count, item.state);
      });
    });
  }

  private pushData(category_id: number, count: number, state: string): void {
    const completeStates = ['COMPLETED', 'APPROVED'];

    if( this.data[category_id] === undefined ){
      this.data[category_id] = {
        total: 0,
        completed: 0,
        category: this.dir.get(category_id).name,
      };
    }

    if( completeStates.indexOf(state) >= 0 ){
      this.data[category_id].completed += count;
    }
    this.data[category_id].total += count;
  }

  getCategoryIds(): Array<string> {
    return Object.keys(this.data);
  }

}
