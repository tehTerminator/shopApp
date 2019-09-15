import { Component, OnInit, OnDestroy } from '@angular/core';
import { MySQLService } from './../../service/my-sql.service';
import { interval } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-slot-view',
  templateUrl: './slot-view.component.html',
  styleUrls: ['./slot-view.component.css']
})
export class SlotViewComponent implements OnInit, OnDestroy {
  theDate: string;
  slots: Array<any> = [];
  total = 0;
  completed = 0;
  private timerSubscription: any;

  constructor(private db: MySQLService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.theDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getSlots();
    const timer = interval(1000 * 60);
    this.timerSubscription = timer.subscribe(() => {
      this.get();
    });
    this.get();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }


  getSlots(): void {
    this.db.select('slots').subscribe((res: any) => {
      Array.from(res).forEach((item: any) => {
        this.slots.push({
          id: +item.id,
          title: `${item.startTime} - ${item.endTime}`,
          totalCount: 0,
          completed: 0,
          startTime: +item.startTime.substr(0, 2),
          endTime: +item.endTime.substr(0, 2)
        });
      });
    });
  }

  get(): void {
    this.total = 0;
    this.completed = 0;
    const request = {
      andWhere: {
        'DATE(forDate)': this.theDate
      }
    };

    for (const iterator of this.slots) {
      iterator.totalCount = 0;
      iterator.completed = 0;
    }

    this.db.select('bookings', request, true).subscribe((res: any) => {
      console.log(res);
      for (const item of res.rows) {
        const selectedSlot = this.slots.find(x => +x.id === +item.slot_id);
        if ( +item.completed === 1 ) {
          // If True
          selectedSlot.completed += 1;
          this.completed += 1;
        }
        selectedSlot.totalCount += 1;
        this.total += 1;
      }
    });
  }

  getClass(startTime: number, endTime: number): string {
    const currentTime = new Date();
    console.log(currentTime, startTime, endTime);
    if( currentTime.getHours() >= startTime && currentTime.getHours() < endTime ){
      return 'active';
    } else {
      return '';
    }
  }
}
