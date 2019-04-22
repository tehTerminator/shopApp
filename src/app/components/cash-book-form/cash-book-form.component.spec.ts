import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashBookFormComponent } from './cash-book-form.component';

describe('CashBookFormComponent', () => {
  let component: CashBookFormComponent;
  let fixture: ComponentFixture<CashBookFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashBookFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
