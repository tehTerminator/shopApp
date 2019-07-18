import { Task } from '../interface/task';
import { Time } from './time';

export class DaySlot {
    private myDate: Date;
    private slotIndex: number;
    private startTime: Time = new Time(0, 0, 0);
    private endTime: Time = new Time(0, 0, 0);
    private myTask: Array<Task>;

    constructor() {
        this.myDate = new Date();
        this.myTask = [];
    }

    setDate(theDate: Date): void {
        this.myDate = theDate;
    }

    setStartTime(theTime: string): void {
        this.startTime.set(theTime);
    }

    setEndTime(theTime: string): void {
        this.endTime.set(theTime);
    }

    getStart(): Date {
        const d = this.myDate;
        d.setHours(this.startTime.getHour());
        d.setMinutes(this.startTime.getMinute());
        d.setSeconds(this.startTime.getSecond());
        return d;
    }

    getEnd(): Date {
        const d = this.myDate;
        d.setHours(this.endTime.getHour());
        d.setMinutes(this.endTime.getMinute());
        d.setSeconds(this.endTime.getSecond());
        return d;
    }

    setIndex(index: number): void {
        this.slotIndex = index;
    }

    pushTask(theTask: Task): void {
        this.myTask.push(theTask);
    }

    getTasks(): Array<Task> {
        return this.myTask;
    }

    getDate(): Date {
        return this.myDate;
    }

    getIndex(): number {
        return this.slotIndex;
    }

    getTimeRange(): string {
        return `${this.startTime.toString()} - ${this.endTime.toString()}`;
    }
}
