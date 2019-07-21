import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTaskByNameComponent } from './search-task-by-name.component';

describe('SearchTaskByNameComponent', () => {
  let component: SearchTaskByNameComponent;
  let fixture: ComponentFixture<SearchTaskByNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTaskByNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTaskByNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
