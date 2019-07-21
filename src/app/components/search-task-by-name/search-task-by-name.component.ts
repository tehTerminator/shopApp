import { Component, OnInit } from '@angular/core';
import { MySQLService } from '../../service/my-sql.service';

@Component({
  selector: 'app-search-task-by-name',
  templateUrl: './search-task-by-name.component.html',
  styleUrls: ['./search-task-by-name.component.css']
})
export class SearchTaskByNameComponent implements OnInit {
  private slots: Array<any> = [];
  result: Array<any> = [];
  theName: string;

  constructor(private ds: MySQLService) { }

  ngOnInit() {
    this.getSlots();
  }

  private getSlots(): void {
    this.ds.select('slots').subscribe((res: any) => {
      for (const it of res) {
        this.slots.push({
          id: it.id,
          title: `${it.startTime} - ${it.endTime}`
        });
      }
    });
  }

  search(): void {
    this.ds.select('task', {
      columns: ['task.customerName',
        'task.id',
        'bookings.slot_id',
        'bookings.forDate',
        'bookings.completed'
      ],
      andWhere: {
        customerName: ['LIKE', `${this.theName}%`]
      },
      join: 'bookings on bookings.task_id = task.id'
    }).subscribe((res: any) => {
      for (const it of res) {
        const data: {[k: string]: any} = {};
        data.customerName = it.customerName;
        data.id = it.id;
        data.slot_id = it.slot_id === '' ? 0 : +it.slot_id;
        data.description = it.forDate;
        data.completed = +it.completed === 1;
        if ( data.slot_id > 0 ) {
          data.description += ` ${this.slots.find(x => x.id === data.slot_id).title}`;
        }
        this.result.push(data);
      }
    });
  }

}
