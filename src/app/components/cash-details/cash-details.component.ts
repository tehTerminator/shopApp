import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cash-details',
  templateUrl: './cash-details.component.html',
  styleUrls: ['./cash-details.component.css']
})
export class CashDetailsComponent {
  notes = {
    2000: 0,
    500: 0,
    200: 0,
    100: 0,
    50: 0,
    20: 0,
    10: 0,
    5: 0,
    2: 0,
    1: 0,
  };

  customerPaid = 0;
  billAmount = 0;
  returnAmount = 0;

  constructor() { }

  objectKey(): Array<string> {
    return Object.keys(this.notes);
  }

  calculate = () => {
    let totalAmount = 0;
    this.objectKey().forEach((item: string) => {
      totalAmount += +item * this.notes[item];
    });
    this.customerPaid = totalAmount;
    this.calculateReturnAmount();
  }

  calculateReturnAmount = () => {
    this.returnAmount = this.customerPaid - this.billAmount;
  }

  reset() {
    this.notes = {
      2000: 0,
      500: 0,
      200: 0,
      100: 0,
      50: 0,
      20: 0,
      10: 0,
      5: 0,
      2: 0,
      1: 0,
    };
    this.returnAmount = 0;
    this.billAmount = 0;
    this.customerPaid = 0;
  }

}
