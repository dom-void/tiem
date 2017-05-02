class Time {
    constructor (actualValue) {
        this._actualValue = actualValue;
    }
    getTime() {
        let date = new Date();
        let timeZoneOffset = date.getTimezoneOffset() * minutes;
        let actualTime = date.getTime() - timeZoneOffset; // counting from 1 Jan 1970
        return actualTime;
    }
}