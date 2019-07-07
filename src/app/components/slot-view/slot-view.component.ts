import { Component, OnInit, OnDestroy } from '@angular/core';
import { MySQLService } from './../../service/my-sql.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-slot-view',
  templateUrl: './slot-view.component.html',
  styleUrls: ['./slot-view.component.css']
})
export class SlotViewComponent implements OnInit, OnDestroy {
  theDate: Date;
  slots: Array<any> = [];
  total = 0;
  completed = 0;
  private timerSubscription: any;

  constructor(private db: MySQLService) { }

  ngOnInit() {
    this.getSlots();
    const timer = interval(1000 * 60);
    this.timerSubscription = timer.subscribe(() => {
      this.get();
    });
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
          completed: 0
        });
      });
    });
  }

  get(): void {
    this.total = 0;
    this.completed = 0;
    const request = {
      andWhere: {
        forDate: this.theDate
      }
    };

    for (const iterator of this.slots) {
      iterator.totalCount = 0;
      iterator.completed = 0;
    }

    this.db.select('bookings', request).subscribe((res: any) => {
      for (const item of res) {
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
}
