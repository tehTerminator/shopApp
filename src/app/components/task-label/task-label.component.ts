import { Task } from './../../interface/task';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-task-label',
  template: `
    Name : {{ customer }}
  `,
  styleUrls: ['./task-label.component.css']
})
export class TaskLabelComponent implements OnInit {
  @Input() customer: string;
  constructor() { }

  ngOnInit() {
  }

}
