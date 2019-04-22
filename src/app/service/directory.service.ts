import { MySQLService } from './my-sql.service';
import { Injectable } from '@angular/core';
import { Directory } from '../interface/directory';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  private data: Array<Directory> = [];

  constructor(private mysql: MySQLService) {
    this.mysql.select('directory').subscribe((res: any) => this.set(res));
  }

  reset(): void {
    this.data = [];
  }

  set(theData: Array<any>): void {
    this.reset();
    theData.forEach((item: any) => {
      this.data.push({ id: +item.id, name: item.name, type: item.type });
    });
  }

  get(id: number): Directory {
    return this.data.find(x => +x.id === +id);
  }

  find(theName: string): Directory {
    const result = this.data.find(x => x.name.toLowerCase().indexOf(theName.toLowerCase()) >= 0);
    if (result === undefined) {
      return {
        id: 0,
        name: 'None',
        type: 'account'
      };
    } else {
      return result;
    }
  }

  /**
   *
   * @param theType string used to filter Directory based on its Type
   */
  private filterDirectory(theType: string): Array<Directory> {
    return this.data.filter(x => x.type.indexOf(theType) >= 0);
  }

  /**
   * Filters Product From Directory
   */
  getProducts(): Array<Directory> {
    return this.filterDirectory('product');
  }

  /**
   * Filters Account from Directory
   */
  getAccounts(): Array<Directory> {
    return this.filterDirectory('account');
  }

  /**
   * Filters Category from Directory
   */
  getCategories(): Array<Directory> {
    return this.filterDirectory('category');
  }
}
