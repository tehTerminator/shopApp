import { Component, OnInit } from '@angular/core';
import { UserService } from './../../service/user.service';
import { DirectoryService } from './../../service/directory.service';
import { MySQLService } from './../../service/my-sql.service';

@Component({
  selector: 'app-operator-report',
  templateUrl: './operator-report.component.html',
  styleUrls: ['./operator-report.component.css']
})
export class OperatorReportComponent implements OnInit {
  fromDate: Date = new Date();
  toDate: Date = new Date();
  singleDay = false;
  selectedUserId: number;
  taskData: Array<any> = [];
  cbData: Array<any> = [];

  constructor(
    public userService: UserService,
    public directory: DirectoryService,
    private db: MySQLService
  ) {}

  ngOnInit() {}

  get(): void {
    this.getCashbookData();
    this.getTaskData();
  }

  getCashbookData(): void {
    const request: any = {
      columns: [
        'SUM(amount) as amount',
        'DATE(postedOn) as postedOn',
        'giver_id'
      ],
      groupBy: 'DATE(postedOn), giver_id',
      andWhere: {
        giver_id: [
          'IN',
          this.directory.find('sales').id,
          this.directory.find('commission').id,
          'LIST'
        ],
        state: ['<>', 'REJECTED'],
        insertedBy: this.selectedUserId,
      },
      orderBy: 'postedOn ASC'
    };

    if (this.singleDay) {
      request.andWhere['DATE(postedOn)'] = this.fromDate;
    } else {
      request.andWhere['DATE(postedOn)'] = [
        'BETWEEN',
        this.fromDate,
        this.toDate
      ];
    }

    this.db.select('cashbook', request).subscribe((res: any) => {
      this.cbData = res;
    });
  }

  objectKeys(theObject: any): Array<string> {
    return Object.keys(theObject);
  }

  countDateEntries(theDate: string): number {
    return this.cbData.filter(x => x.postedOn === theDate).length;
  }

  isFirst(index: number): boolean{
    if( index === 0 ){
      return true;
    } else {
     return this.cbData[index].postedOn !== this.cbData[index - 1].postedOn;
    }
  }

  getTaskData(): void {
    const request: any = {
      columns: ['COUNT(id) as jobCompleted', 'DATE(insertedAt) as postedOn', 'SUM(amountCollected) as amount'],
      andWhere: {
        acceptedBy: this.selectedUserId,
        state: ['IN', 'COMPLETED', 'APPROVED', 'LIST']
      },
      groupBy: 'postedOn',
      orderBy: 'postedOn ASC'
    };

    if (this.singleDay) {
      request.andWhere['DATE(insertedAt)'] = this.fromDate;
    } else {
      request.andWhere['DATE(insertedAt)'] = [
        'BETWEEN',
        this.fromDate,
        this.toDate
      ];
    }

    this.db.select('task', request).subscribe((res: any) => {
      this.taskData = res;
    });
  }

  toggleRange(): void {
    this.singleDay = !this.singleDay;
  }
}
