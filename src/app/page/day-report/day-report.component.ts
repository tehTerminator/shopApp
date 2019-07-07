import { Component, OnInit } from '@angular/core';
import { DirectoryService } from './../../service/directory.service';
import { MySQLService } from './../../service/my-sql.service';

@Component({
  selector: 'app-day-report',
  templateUrl: './day-report.component.html',
  styleUrls: ['./day-report.component.css']
})
export class DayReportComponent implements OnInit {
  theDate: Date;
  
  constructor(private mysql: MySQLService, public dir: DirectoryService) { }

  ngOnInit() {
    this.theDate = new Date();
  }

}
