import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MySQLService } from '../../service/my-sql.service';
import { UserService } from '../../service/user.service';
import { Batch } from '../../class/batch';
import { Task } from '../../interface/task';
import { BatchService } from '../../service/batch.service';
import { CashTransaction } from '../../interface/cash-transaction';
import { ProductTransaction } from '../../interface/product-transaction';
import { DirectoryService } from '../../service/directory.service';

@Component({
  selector: 'app-task-entry-form',
  templateUrl: './task-entry-form.component.html',
  styleUrls: ['./task-entry-form.component.css']
})
export class TaskEntryFormComponent implements OnInit {
  @ViewChild('name') nameField: ElementRef;
  selectedBatch = 0;
  batch: Array<Batch> = [];
  suggestion: Array<string> = [];
  task: Task;
  showSuggestion = false;
  cashTransactions: Array<CashTransaction> = [];
  productTransactions: Array<ProductTransaction> = [];
  slots: Array<any> = [];
  slotDate = new Date();
  slotId: number;
  categoryId: number;

  constructor(
    private db: MySQLService,
    private us: UserService,
    private bs: BatchService,
    public ds: DirectoryService
  ) { }

  ngOnInit() {
    // Initialize Task;
    this.task = {
      customerName: '',
      category_id: 0,
      insertedBy: this.us.currentUser.id,
      amountCollected: 0,
      state: 'INACTIVE',
    };


    // Load Slots
    this.db.select('slots').subscribe((res: any) => {
      Array.from(res).forEach((item: any) => {
        this.slots.push({
          id: +item.id,
          title: `${item.startTime} to ${item.endTime}`
        });
      });
    });
  }

  loadBatch(): void {
        // Load Batch Task from Server
        console.log('Load Batch Called')
        this.db.select('batch', {orderBy: 'title ASC'}).subscribe((res: any) => {
          const allBatch = [];
          Array.from(res).forEach((s: any) => {
            allBatch.push(new Batch(s.id, s.title, s.rate, s.settings));
          });
          console.table(allBatch);
          this.batch = allBatch.filter((x: Batch) => x.hasCategory(+this.categoryId));
        });
  }

  onSearchChange(searchValue: string) {
    const word = this.task.customerName.split(' ').pop() + '%';
    if (word.length >= 3) {
      this.db.select('suggestion', {
        andWhere: {
          theName: ['LIKE', word]
        }
      }).subscribe((res: any) => {
        this.suggestion = [];
        res.forEach((item: any) => {
          this.suggestion.push(item.theName);
        });
        this.showSuggestion = this.suggestion.length > 0;
      });
    } else {
      this.showSuggestion = false;
      this.suggestion = [];
    }
  }

  useSuggestion(theName: string) {
    theName = theName.toLowerCase().replace(/\b\S/g, t => t.toUpperCase());
    const wordArray = this.task.customerName.split(' ');
    wordArray.pop();
    wordArray.push(theName);
    this.task.customerName = wordArray.join(' ');
    this.nameField.nativeElement.focus();
  }

  save(bookSlot: boolean) {
    // Update Word Dictionary
    const wordArray = this.task.customerName.split(' ');
    wordArray.forEach((item: string) => {
      this.db.insert('suggestion', {
        userData: {
          theName: item
        }
      }, true).subscribe((res: any) => {
        console.log(res.query);
      });
    });

    // Update Description of Cashbook Entries
    const jobType = this.batch.find(x => +x.id === +this.selectedBatch ).title;
    this.cashTransactions.forEach((item: CashTransaction) => {
      item.description = `${this.task.customerName} - ${jobType}`;
    });

    // Submit Data
    this.bs.set(this.task, this.cashTransactions, this.productTransactions);
    if ( bookSlot ) {
      try {
        const slotTitle = this.slots.find( x => +x.id === +this.slotId).title;
        this.bs.setSlot(this.slotId, this.slotDate, slotTitle);
      } catch (e) {
        alert('Invalid Date or Time For Booking');
        return;
      }
    }
    this.bs.save();
    this.reset();
  }

  extractDetails() {
    const b = this.batch.find(x => +x.id === +this.selectedBatch);

    let entries = b.getProductSettings();
    this.productTransactions = [];
    entries.forEach((item: any) => {
      this.productTransactions.push({
        product_id: +item.product_id,
        quantity: +item.quantity,
        amount: item.amount !== undefined ? +item.amount : 0,
      });
    });

    entries = b.getCashBookSettings();
    this.cashTransactions = [];
    entries.forEach((item: any) => {
      this.cashTransactions.push({
        giver_id: +item.giver_id,
        receiver_id: +item.receiver_id,
        amount: +item.amount,
        description: '',
        state: 'PENDING',
        insertedBy: this.us.currentUser.id,
      });
    });

    if (b.doesItCreatesTask()) {
      this.task.category_id = +b.getTaskSettings()[0].category_id;
      this.task.amountCollected = +b.rate;
    }
  }

  reset(): void {
    this.task.customerName = '';
    this.task.state = 'INACTIVE';
    this.nameField.nativeElement.focus();
  }
}
