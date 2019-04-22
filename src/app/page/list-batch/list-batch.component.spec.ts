import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServicesComponent as ListBatchComponent } from './list-batch.component';

describe('ListServicesComponent', () => {
  let component: ListBatchComponent;
  let fixture: ComponentFixture<ListBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListBatchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
