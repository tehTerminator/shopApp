import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorReportComponent } from './operator-report.component';

describe('OperatorReportComponent', () => {
  let component: OperatorReportComponent;
  let fixture: ComponentFixture<OperatorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
