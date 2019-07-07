import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedCashbookComponent } from './combined-cashbook.component';

describe('CombinedCashbookComponent', () => {
  let component: CombinedCashbookComponent;
  let fixture: ComponentFixture<CombinedCashbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinedCashbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedCashbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
