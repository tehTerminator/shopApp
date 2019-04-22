import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MySQLService {
  // private serverLink = 'http://localhost:80/api/sql.php';
  private serverLink = 'http://192.168.0.101/api/sql.php';
  constructor(private http: HttpClient) { }

  private execute(theType: string, TheTable: string, theParams?: any, verbose?: boolean) {
    const request = {
      queryType: theType,
      tableName: TheTable,
      params: theParams
    };

    if (verbose) {
      return this.http.post(this.serverLink, request);
    } else {
      return this.http.post(this.serverLink, request).pipe(map((response: any) => response.rows));
    }
  }

  select(tableName: string, params?: any, verbose?: boolean): any {
    return this.execute('select', tableName, params, verbose);
  }

  insert(tableName: string, params?: any, verbose?: boolean): any {
    return this.execute('insert', tableName, params, verbose);
  }

  update(tableName: string, params?: any, verbose?: boolean): any {
    return this.execute('update', tableName, params, verbose);
  }

  delete(tableName: string, params?: any, verbose?: boolean): any {
    return this.execute('delete', tableName, params, verbose);
  }
}
