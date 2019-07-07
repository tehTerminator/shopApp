import { NotificationService } from './../../service/notification.service';
import { Directory } from './../../interface/directory';
import { MySQLService } from './../../service/my-sql.service';
import { Component, OnInit } from '@angular/core';
import { resetCompiledComponents } from '@angular/core/src/render3/jit/module';

@Component({
  selector: 'app-directory-form',
  templateUrl: './directory-form.component.html',
  styleUrls: ['./directory-form.component.css']
})
export class DirectoryFormComponent implements OnInit {
  directory: Directory;

  constructor(private mysql: MySQLService, private notice: NotificationService) { }

  ngOnInit(): void {
    this.reset();
  }

  getDirectory(): void {
    if (this.directory.id > 0) {
      this.mysql.select('directory', {
        andWhere: { id: this.directory.id }
      }).subscribe((response: any) => {
        if (response.length > 0) {
          const result = response[0];
          this.directory.id = result.id;
          this.directory.name = result.name;
          this.directory.type = result.type;
        } else {
          this.reset();
        }
      });
    } else {
      this.reset();
    }
  }

  reset() {
    this.directory = {
      id: 0,
      name: '',
      type: 'product'
    };
  }

  save() {
    const request: any = {
      userData: {
        name: this.directory.name,
        type: this.directory.type
      }
    };

    let response: any;
    const message = { text: 'Success', state: 'green' };

    if (this.directory.id > 0) {
      // Update Directory
      request.andWhere = { id: this.directory.id };
      response = this.mysql.update('directory', request, true);
      message.text = 'Successfully Updated Directory Name - ' + this.directory.name;
    } else {
      response = this.mysql.insert('directory', request, true);
      message.text = 'Successfully Created New Directory Name - ' + this.directory.name;
    }

    response.subscribe((res: any) => this.notice.changeMessage(message));
  }

}
