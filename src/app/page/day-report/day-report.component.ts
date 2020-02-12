import { Component, OnInit } from '@angular/core';
import { DirectoryService } from './../../service/directory.service';
import { MySQLService } from './../../service/my-sql.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-day-report',
  templateUrl: './day-report.component.html',
  styleUrls: ['./day-report.component.css']
})
export class DayReportComponent implements OnInit {
  theDate: string;
  accountList: Array<string> = [
    'sales',
    'commission',
    'expense',
    'shop',
    'mponline',
    'csc',
    'sbi maharaja',
    'hdfc bank'
  ];
  selectedAccount: number;

  constructor(
    private mysql: MySQLService,
    public dir: DirectoryService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.theDate = this.datePipe.transform( new Date(), 'yyyy-MM-dd');
  }

  isInList(accountName: string): boolean {
    return this.accountList.indexOf(accountName.toLowerCase()) >= 0;
  }

  addToList(): void {
    if ( this.selectedAccount > 0 ) {
      this.accountList.push( this.dir.get(this.selectedAccount).name.toLowerCase() );
    }
  }

  removeFromList(theName: string): void {
    const index = this.accountList.indexOf(theName);
    this.accountList.splice(index, 1);
  }


}
