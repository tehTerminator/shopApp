import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyEarningComponent } from './daily-earning.component';

describe('DailyEarningComponent', () => {
  let component: DailyEarningComponent;
  let fixture: ComponentFixture<DailyEarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyEarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
