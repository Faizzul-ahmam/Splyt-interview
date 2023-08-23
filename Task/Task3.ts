class MeetingScheduler {
    schedules: string[][][];
    startOfWork: number;
    endOfWork: number;
    earliestStart: number;

    constructor(schedules: string[][][]) {
        this.schedules = schedules;
        this.startOfWork = 9 * 60;
        this.endOfWork = 19 * 60;
        this.earliestStart = this.startOfWork;
    }

    getStartTime(duration: number): string | null {
        while (true) {
            let foundSlot = true;
            for (const schedule of this.schedules) {
                let busy = false;
                for (const meeting of schedule) {
                    const meetingStart = this.timeToMinutes(meeting[0]);
                    const meetingEnd = this.timeToMinutes(meeting[1]);
                    if (meetingStart <= this.earliestStart && meetingEnd > this.earliestStart) {
                        this.earliestStart = meetingEnd;
                        busy = true;
                        break;
                    }
                    if (meetingStart > this.earliestStart && meetingStart < this.earliestStart + duration) {
                        this.earliestStart = meetingEnd;
                        busy = true;
                        break;
                    }
                }
                if (busy) {
                    foundSlot = false;
                    break;
                }
            }
            if (foundSlot && this.endOfWork - this.earliestStart >= duration) {
                return this.minutesToTime(this.earliestStart);
            }
            if (this.earliestStart >= this.endOfWork) {
                return null;
            }
        }
    }

    timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    minutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
    }
}


let BusinessmanSchedules = [
    [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
    [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
    [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']]
];

let Scheduler = new MeetingScheduler(BusinessmanSchedules);

console.log(Scheduler.getStartTime(60))
console.log(Scheduler.getStartTime(180))
console.log(Scheduler.getStartTime(120))