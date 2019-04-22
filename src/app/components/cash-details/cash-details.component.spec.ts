import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDetailsComponent } from './cash-details.component';

describe('CashDetailsComponent', () => {
  let component: CashDetailsComponent;
  let fixture: ComponentFixture<CashDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
