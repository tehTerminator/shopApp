import { MySQLService } from './../../service/my-sql.service';
import { DirectoryService } from './../../service/directory.service'
import { Component, OnInit } from '@angular/core';

@Component({
		selector: 'app-directory-table',
		templateUrl: './directory-table.component.html',
		styleUrls: ['./directory-table.component.css']
})
export class DirectoryTableComponent implements OnInit {
		searchText = '';
		constructor(private mysql: MySQLService, public directory: DirectoryService) { }

		ngOnInit() {
				this.getData();
		}

		getData(): void{
				this.directory.set();
		}

}
