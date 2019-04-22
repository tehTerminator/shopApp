import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashBookTableComponent } from './cash-book-table.component';

describe('CashBookTableComponent', () => {
  let component: CashBookTableComponent;
  let fixture: ComponentFixture<CashBookTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashBookTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashBookTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
