import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEntryFormComponent } from './task-entry-form.component';

describe('TaskEntryFormComponent', () => {
  let component: TaskEntryFormComponent;
  let fixture: ComponentFixture<TaskEntryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskEntryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
