import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryTableComponent } from './directory-table.component';

describe('DirectoryTableComponent', () => {
  let component: DirectoryTableComponent;
  let fixture: ComponentFixture<DirectoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectoryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
