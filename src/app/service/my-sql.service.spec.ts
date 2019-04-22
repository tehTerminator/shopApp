import { TestBed } from '@angular/core/testing';

import { MySQLService } from './my-sql.service';

describe('MySQLService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MySQLService = TestBed.get(MySQLService);
    expect(service).toBeTruthy();
  });
});
