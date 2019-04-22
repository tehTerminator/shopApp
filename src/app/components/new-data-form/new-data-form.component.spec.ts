import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDataFormComponent } from './new-data-form.component';

describe('NewDataFormComponent', () => {
  let component: NewDataFormComponent;
  let fixture: ComponentFixture<NewDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
