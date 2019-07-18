export class Time {
    private hour: number;
    private minute: number;
    private second: number;

    /**
     *
     * @param h Hours in 24 Hours Format
     * @param m Minutes
     * @param s Seconds
     */
    constructor(h: number, m: number, s: number) {
        this.hour = h % 24;
        this.minute = m % 60;
        this.second = s % 60;
    }

    toString(): string {
        return `${this.pad(this.hour, 2)}:${this.pad(this.minute, 2)}:${this.pad(this.second, 2)}`;
    }

    set(theTime: string) {
        if ( theTime.indexOf(':') >= 0 ) {
            const t = theTime.split(':');
            this.setHour(+t[0]);
            this.setMinute(+t[1]);
            this.setSecond(+t[2]);
        } else if ( theTime.length === 6 ) {
            this.setHour(+theTime.substr(0, 2));
            this.setMinute( +theTime.substr(2, 2));
            this.setSecond( +theTime.substr(4, 2));
        } else {
            this.setHour(0);
            this.setMinute(0);
            this.setSecond(0);
        }
    }

    setHour(h: number): void {
        this.hour = h % 24;
    }

    setMinute(m: number): void {
        this.minute = m % 60;
    }

    setSecond(s: number): void {
        this.second = s % 60;
    }

    private pad(n: number, width: number): string {
        width -= n.toString().length;
        if (width > 0) {
          return new Array(width + (/\./.test(n.toString()) ? 2 : 1)).join('0') + n;
        }
        return n + ''; // always return a string
    }

    getHour(): number {
        return this.hour;
    }

    getMinute(): number {
        return this.minute;
    }

    getSecond(): number {
        return this.second;
    }
}
