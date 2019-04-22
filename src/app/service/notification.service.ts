import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private messageSource = new BehaviorSubject({ id: undefined, text: 'Welcome', status: 'green' });
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(someMessage: any) {
    this.messageSource.next(someMessage);
  }
}
