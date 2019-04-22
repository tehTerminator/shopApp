import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSegmentComponent } from './notification-segment.component';

describe('NotificationSegmentComponent', () => {
  let component: NotificationSegmentComponent;
  let fixture: ComponentFixture<NotificationSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
