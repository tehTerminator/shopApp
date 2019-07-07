export class Batch {

    constructor(theId: any, theTitle: string, theRate: any, someSettings: any) {
        this.id = +theId;
        this.title = theTitle;
        this.rate = +theRate;
        if (typeof (someSettings) === 'string' || someSettings instanceof String) {
            this.settings = JSON.parse(someSettings.toString());
        } else {
            this.settings = someSettings;
        }
    }

    public readonly requiredKeys = {
        product: ['product_id', 'quantity', 'amount'],
        cashbook: ['giver_id', 'receiver_id', 'amount'],
        task: ['category_id']
    };

    public id: number;
    public title: string;
    public rate: number;
    public settings: Array<any>;

    toMySqlFormat(): any {
        const response = {
            id: this.id,
            title: this.title,
            rate: this.rate,
            settings: JSON.stringify(this.settings)
        };

        if (response.id === 0) {
            delete (response.id);
        }
        console.log(response);
        return response;
    }

    public doesItCreatesTask(): boolean { return this.doesItContains('category_id'); }
    public doesItUsesProducts(): boolean { return this.doesItContains('product_id'); }
    public doesItCreatesCashbookEntry(): boolean { return this.doesItContains('giver_id'); }

    private doesItContains(theKey: string): boolean {
        let response = false;
        let i = 0;
        for (i = 0; i < this.settings.length; i++) {
            const watchedArray = Object.keys(this.settings[i]);
            if (watchedArray.indexOf(theKey) >= 0) {
                response = true;
                break;
            }
        }
        return response;
    }

    getTaskSettings(): Array<any> {
        if (this.doesItCreatesTask()) {
            return this.settings.filter(x => x.category_id !== undefined);
        } else {
            return [];
        }
    }

    getProductSettings(): Array<any> {
        if (this.doesItUsesProducts()) {
            return this.settings.filter(x => x.product_id !== undefined);
        } else {
            return [];
        }
    }

    getCashBookSettings(): Array<any> {
        if (this.doesItCreatesCashbookEntry()) {
            return this.settings.filter(x => x.giver_id !== undefined);
        } else {
            return [];
        }
    }

    getTotalCashBookAmount(): number {
        let total = 0;
        const cashbookEntries = this.getCashBookSettings();
        cashbookEntries.forEach((c: any) => {
            total += +c.amount;
        });
        return total;
    }

    getType(): string {
        if (this.doesItCreatesTask()) {
            return 'task';
        } else if (this.doesItUsesProducts()) {
            return 'product';
        } else if (this.doesItCreatesCashbookEntry()) {
            return 'cashbook';
        } else {
            return 'Empty Batch';
        }
    }

    isPrimarily(theType: string): boolean {
        return this.getType() === theType;
    }
}
