import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-notification-segment',
  template: `
    <div class="ui block header">
      <i class="bell icon"></i>
      <div class="content">
      Notifications
      </div>
    </div>
    <div class="scrollable">
    <div class="ui segment" *ngFor="let message of messageQueue" [ngClass]="message.state">
    <div class="ui bottom left attached red label" [hidden]="message.id === undefined">{{ message.id }}</div>
    {{ message.text }}
    <hr>
    <div class="ui bottom right attached mini label">{{ message.timestamp | date:'shortTime' }}</div>
    </div>
    </div>
  `
})
export class NotificationSegmentComponent implements OnInit {

  messageQueue: Array<any> = [];
  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.currentMessage.subscribe(message => this.pushMessage(message));
  }

  pushMessage(theMessage: any) {
    const MAX_LENGTH = 20;
    if (this.messageQueue.length < MAX_LENGTH) {
      this.messageQueue.unshift({
        id: theMessage.id,
        timestamp: new Date(),
        text: theMessage.text,
        state: typeof (theMessage.state) === undefined ? 'green' : theMessage.state,
      });
    } else {
      this.messageQueue.splice(MAX_LENGTH - 1, 1);
      this.pushMessage(theMessage);
    }
  }
}
