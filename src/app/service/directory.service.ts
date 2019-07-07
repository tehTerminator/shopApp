import { MySQLService } from './my-sql.service';
import { Injectable } from '@angular/core';
import { Directory } from '../interface/directory';

@Injectable({
	providedIn: 'root'
})
export class DirectoryService {
	private data: Array<Directory> = [];

	constructor(private mysql: MySQLService) {
		this.set();
	}

	reset(): void {
		this.data = [];
	}

	set(): void {
		this.reset();
		this.mysql.select('directory').subscribe((res: Array<Directory>) => {
			Array.from(res).forEach((item: Directory) => {
				this.data.push({ id: +item.id, name: item.name, type: item.type });
			});
		});

	}

	get(id: number): Directory {
		return this.data.find(x => +x.id === +id);
	}

	/**
	 * Finds the Directory using its name
	 * @param theName name of the Directory
	 */
	find(theName: string): Directory {
		theName = theName.toLowerCase();
		const result = this.data.find(x => x.name.toLowerCase().indexOf(theName) >= 0);
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

	getAll(): Array<Directory> {
		return this.data;
	}
}
