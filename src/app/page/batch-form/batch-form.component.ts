import { NotificationService } from '../../service/notification.service';
import { MySQLService } from '../../service/my-sql.service';
import { Batch } from '../../class/batch';
import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../../service/directory.service';

@Component({
  selector: 'app-batch-form',
  templateUrl: './batch-form.component.html',
  styleUrls: ['./batch-form.component.css']
})
export class BatchFormComponent implements OnInit {

  theBatch: Batch;
  selectedSetting = 'product';
  settingsForm = {};
  constructor(
    private mysql: MySQLService,
    private notificationService: NotificationService,
    public directory: DirectoryService
  ) { }

  ngOnInit() {
    this.theBatch = new Batch(0, '', 0, []);
    this.showSettingsForm(this.selectedSetting);
  }

  showSettingsForm(settingName: string) {
    this.settingsForm = {};
    this.selectedSetting = settingName;
    if (this.theBatch.requiredKeys[settingName] !== undefined) {
      this.theBatch.requiredKeys[settingName].forEach((item: string) => {
        this.settingsForm[item] = '';
      });
    }
  }

  objectKeys(someObject: any) {
    return Object.keys(someObject);
  }

  addSetting() {
    const setting = Object.assign({}, this.settingsForm);
    this.theBatch.settings.push(setting);
    console.dir(this.theBatch.doesItCreatesTask());
    console.dir(this.theBatch);
  }

  save() {
    const request = {
      userData: this.theBatch.toMySqlFormat()
    };
    this.mysql.insert('batch', request, true).subscribe((res: any) => {
      this.notificationService.changeMessage({
        id: res.lastInsertId,
        text: `Created new Batch ${this.theBatch.title} of type - ${this.theBatch.getType()}`,
        state: 'green'
      });
      this.reset();
    });
  }

  deleteSetting(someSetting: any) {
    const index = this.theBatch.settings.indexOf(someSetting);
    this.theBatch.settings.splice(index, 1);
  }

  isEmpty() {
    return this.theBatch.title === '';
  }

  reset() {
    this.theBatch = new Batch(0, '', 0, []);
    this.settingsForm = {};
    this.showSettingsForm(this.selectedSetting);
  }
}
