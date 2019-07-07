import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MySQLService } from './../../service/my-sql.service';
import { CashTransaction } from './../../interface/cash-transaction';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.css']
})
export class AccountCardComponent implements OnChanges, OnInit {
    @Input() theName: string;
    @Input() theDate: Date = new Date();
    showMeta = false;
    accountId: number;
    given = 0;
    received = 0;
    total = 0;

    constructor(private db: MySQLService) { }

    ngOnInit() {
        this.getAccountId();
        this.total = 0;
    }

    ngOnChanges(changes: SimpleChanges) {
        try {
            this.theDate = changes.theDate.currentValue;
            if (this.accountId > 0) {
                this.getOpeningBalance();
            }
        } catch (e) {
            console.log(changes, 'It seems there are not changes');
        }
    }

    private getAccountId(): void {
        const request = {
            andWhere: {
                name: this.theName,
                type: 'account'
            }
        };
        this.db.select('directory', request).subscribe((res: any) => {
            if (res.length >= 1) {
                this.accountId = +res[0].id;
                this.getOpeningBalance();
            } else {
                this.accountId = 0;
            }
        });
    }

    private getAmount(): void {
        this.reset();
        const request = {
            andWhere: {
                andWhere: {
                    'DATE(postedOn)': this.theDate,
                    state: ['<>', 'REJECTED']
                },
                orWhere: {
                    giver_id: this.accountId,
                    receiver_id: this.accountId,
                }
            }
        };
        this.db.select('cashbook', request).subscribe((res: any) => {
            Array.from(res).forEach((item: CashTransaction) => {
                if (+item.giver_id === +this.accountId) {
                    this.given += +item.amount;
                } else {
                    this.received += +item.amount;
                }
            });
            this.total += this.received - this.given;
        });
    }

    private getOpeningBalance(): void {
        this.db.select('balance', {
            andWhere: { account_id: this.accountId, 'DATE(postedOn)': this.theDate }
        }).subscribe((res: any) => {
            if (res.length >= 1) {
                this.total = +res[0].openingBalance;
                this.showMeta = true;
            } else {
                this.total = 0;
                this.showMeta = false;
            }   
            this.getAmount();
        });
    }

    private reset(): void {
        this.given = 0;
        this.received = 0;
    }
}
