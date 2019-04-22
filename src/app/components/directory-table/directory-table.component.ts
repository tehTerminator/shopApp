import { MySQLService } from './../../service/my-sql.service';
import { Component, OnInit } from '@angular/core';
import { Directory } from 'src/app/interface/directory';

@Component({
  selector: 'app-directory-table',
  templateUrl: './directory-table.component.html',
  styleUrls: ['./directory-table.component.css']
})
export class DirectoryTableComponent implements OnInit {
  directory: Directory[];
  searchText = '';
  constructor(private mysql: MySQLService) { }

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    this.mysql.select('directory').subscribe((response: any) => {
      this.directory = response;
    });
  }

}
