import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerDateRangeComponent } from './ledger-date-range.component';

describe('LedgerDateRangeComponent', () => {
  let component: LedgerDateRangeComponent;
  let fixture: ComponentFixture<LedgerDateRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerDateRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
