import { Component, OnInit } from '@angular/core';
import { MySQLService } from './../../service/my-sql.service';
import { NotificationService } from './../../service/notification.service';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.css']
})
export class WordListComponent {
  theWord: string;
  wordList: Array<string> = [];
  searchWord: string;
  constructor(private ds: MySQLService, private ns: NotificationService) { }

  onSearchChange(searchWord: string) {
    this.ds.select('suggestion', {
      andWhere: {
        theName: ['LIKE', searchWord + '%']
      }
    }).subscribe((res: any) => {
      this.wordList = [];
      if (searchWord.length >= 2) {
        res.forEach((item: any) => {
          this.wordList.push(item.theName);
        });
      }
    });
  }

  delete(theWord: string) {
    this.ds.delete('suggestion', {
      andWhere: {
        theName: theWord
      }
    }).subscribe(() => {
      const index = this.wordList.indexOf(theWord);
      this.wordList.splice(index, 1);
      this.ns.changeMessage({text: `Successfully Deleted ${theWord} from Dictionary`, status: 'green'});
    });
  }

  save() {
    const wordList = this.theWord.split(' ');
    wordList.forEach((item: string) => {
      this.ds.insert('suggestion', {
        userData: {
          theName: item
        }
      }, true).subscribe((res: any) => {
        if ( +res.rowCount >= 1 ) {
          this.ns.changeMessage({text: `Created New Dictionary ${item}`, status: 'green'});
        } else {
          this.ns.changeMessage({text: `Unable to execute Query ${res.query}`, status: 'red'});
        }
      });
    });
    this.theWord = '';
  }
}
