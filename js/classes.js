class Time {
    constructor() {
        this.actualHours;
        this.actualMinutes;
        this.actualSeconds;
    }
    timeGet() {
        var date = new Date();
        var timeZoneOffset = date.getTimezoneOffset() * minutes;
        var actualTime = date.getTime() - timeZoneOffset; // counting from 1 Jan 1970
        return actualTime;
    }
    setTimeParameters() {
        var actualTime = this.timeGet();
        var fullDaysInActualTime = Math.floor(actualTime / halfDays) * halfDays;
        var daylySeconds = actualTime - fullDaysInActualTime;
        this.actualHours = (daylySeconds / hours).toFixed(2);
        this.actualMinutes = ((daylySeconds - Math.floor(this.actualHours) * hours) / minutes).toFixed(2);
        this.actualSeconds = ((daylySeconds - ((Math.floor(this.actualHours) * hours) + Math.floor(this.actualMinutes) * minutes)) / seconds).toFixed(2);
    }
    getTimeValue(name) {
        switch (name) {
            case 'seconds':
                return this.actualSeconds;
            // break;
            case 'minutes':
                return this.actualMinutes;
            // break;
            case 'hours':
            case 'work':
                return this.actualHours;
            // break;
            default:
                console.log('wrong getTimeValue() param: "seconds", "minutes", "hours" or "work"');
                break;
        }
    }
}

function Dial(name, innerRad, outerRad, color) {
    this.name = name;
    this.centerX = 150;
    this.centerY = 150;
    this.innerRadius = innerRad;
    this.outerRadius = outerRad;
    this.angleOffset = -.5 * Math.PI;
    this.angleTimerStart;
    this.angleStart; // (function () { return this.angleOffset; })();
    this.angleEnd;
    this.fullDialValue = 60;
    this.color = color;
}
Dial.prototype.setStart = function (mode) {
    switch (mode) {
        case 'clock':
            this.angleStart = this.angleOffset;
            break;
        case 'timer':
            this.angleStart = this.angleTimerStart;
            break;
        default:
            console.log('wrong setStart() param: "clock", "timer" or "work"');
            break;
    }
}
Dial.prototype.setAngle = function (side) {
    time.setTimeParameters();
    switch (side) {
        case 'start':
            this.angleTimerStart = this.angleOffset + time.getTimeValue(this.name) * (2 * Math.PI / this.fullDialValue);
            // this.angleStart = this.angleTimerStart;
            break;
        case 'end':
            this.angleEnd = this.angleOffset + time.getTimeValue(this.name) * (2 * Math.PI / this.fullDialValue);
            break;
        case 'workstart':
            this.angleStart = this.angleOffset;
            this.angleTimerStart = time.getTimeValue(this.name) * (2 * Math.PI / this.fullDialValue);
            break;
        case 'workend':
            this.angleEnd = this.angleStart + (time.getTimeValue(this.name) * (2 * Math.PI / this.fullDialValue) - this.angleTimerStart);
            break;
        default:
            console.log('wrong setAngle() param: "start", "end" or "work"');
            break;
    }
}
Dial.prototype.draw = function () {
    // this.angleStart = angleStart;
    // this.angleEnd = angleEnd;
    context.beginPath();
    context.arc(this.centerX, this.centerY, this.innerRadius, this.angleStart, this.angleEnd, false);
    context.arc(this.centerX, this.centerY, this.outerRadius, this.angleEnd, this.angleStart, true);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
}

export { Time }