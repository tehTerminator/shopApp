import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLabelComponent } from './task-label.component';

describe('TaskLabelComponent', () => {
  let component: TaskLabelComponent;
  let fixture: ComponentFixture<TaskLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
