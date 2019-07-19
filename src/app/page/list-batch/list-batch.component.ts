import { Batch } from './../../class/batch';
import { MySQLService } from '../../service/my-sql.service';
import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../../service/directory.service';

@Component({
  selector: 'app-list-batch',
  templateUrl: './list-batch.component.html',
})
export class ListBatchComponent implements OnInit {
  batch = [];
  selectedBatch: Batch;
  constructor(private mysql: MySQLService, public directory: DirectoryService) { }

  ngOnInit() {
    this.fetchData();
    this.selectedBatch = new Batch(0, '', 0, []);
  }

  fetchData() {
    this.mysql.select('batch').subscribe((res: any) => {
      res.forEach((item: any) => {
        this.batch.push(new Batch(item.id, item.title, item.rate, item.settings));
      });
    });
  }

  selectBatch(batch: Batch) {
    this.selectedBatch = batch;
    console.log(this.selectedBatch);
  }

  objectKeys(someObject: any): Array<string> {
    return Object.keys(someObject);
  }

}
