import { Component, OnInit } from '@angular/core';
import { MySQLService } from './../../service/my-sql.service';
import { DirectoryService } from './../../service/directory.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-daily-earning',
  templateUrl: './daily-earning.component.html',
  styleUrls: ['./daily-earning.component.css']
})
export class DailyEarningComponent implements OnInit {
  theDate: string;
  sales: Array<any> = [];
  commission: number;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  chartData: Array<any> = [];

  constructor(private db: MySQLService, private ds: DirectoryService) { }

  ngOnInit() {
  }

  get() {
    // Get Sales
    const salesAccountId = this.ds.find('sales').id;
    const commAccId = this.ds.find('commission').id;

    this.db.select('cashbook', {
      columns: ['COUNT(description) as count', 'description', 'SUM(amount) as amount'],
      andWhere: {
        'DATE(postedOn)' : this.theDate,
        giver_id: salesAccountId
      },
      groupBy: 'description'
    }, true).subscribe((res: any) => {
      this.sales = res.rows;
      this.sales.forEach((item: any) => {
        this.chartData.push({
          name: item.description,
          value: item.amount
        });
      });
      console.table(this.chartData);
    });

    this.db.select('cashbook', {
      columns: ['sum(amount) as amount'],
      andWhere: {
        'DATE(postedOn)' : this.theDate,
        giver_id: commAccId
      }
    }).subscribe((res: any) => {
      if ( res.length >= 1 ) {
        this.commission = +res[0].amount;
      }
    });
  }

}
