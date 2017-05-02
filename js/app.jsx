
const seconds = 1000;
const minutes = seconds * 60;
const hours = minutes * 60;
const halfDays = hours * 12;
const days = 2 * halfDays;

const hoursColor = 'rgba(255,0,0,.7)';
const minutesColor = 'rgba(0,0,255,.5)';
const secondsColor = 'rgba(100,255,0,.5)';
const workTimeColor = 'rgba(200,200,200,.9)';
// import { Time } from './classes.js'

document.addEventListener('DOMContentLoaded', function () {

    const canvas = document.getElementById("clock");
    const context = canvas.getContext("2d");
    // taking seconds in actual 24h period from .getTime()

    var switcher = true;


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

    var time = new Time();

    var angleStart = -.5 * Math.PI;

    class Dial {
        constructor(name, innerRad, outerRad, color) {
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
        setStart(mode) {
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
        setAngle(side) {
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
        draw() {
            // this.angleStart = angleStart;
            // this.angleEnd = angleEnd;
            context.beginPath();
            context.arc(this.centerX, this.centerY, this.innerRadius, this.angleStart, this.angleEnd, false);
            context.arc(this.centerX, this.centerY, this.outerRadius, this.angleEnd, this.angleStart, true);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
        }
    }
    
    var hoursDial = new Dial('hours', 60, 140, hoursColor);
    hoursDial.fullDialValue = 12;
    var minutesDial = new Dial('minutes', 40, 110, minutesColor);
    var secondsDial = new Dial('seconds', 20, 75, secondsColor);
    var timeOfWorkDial = new Dial('work', 143, 147, workTimeColor);
    timeOfWorkDial.fullDialValue = 12;

    hoursDial.setAngle('start');
    minutesDial.setAngle('start');
    secondsDial.setAngle('start');
    timeOfWorkDial.setAngle('workstart');
    hoursDial.setStart('timer');
    minutesDial.setStart('timer');
    secondsDial.setStart('timer');

    // window.requestAnimationFrame = function (callback) {
    //     window.setTimeout(callback, 1000 / 1);
    // };

    window.requestAnimationFrame = (function () {
        if (switcher) {
            return function (callback) {
                window.setTimeout(callback, 1000 / 2);
            }
        } else {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }
    })();

    var button1 = document.querySelector('#button1');
    var button2 = document.querySelector('#button2');
    button2.classList.add('active-button');

    document.getElementById('button1').addEventListener('click', function () {
        // clock
        hoursDial.setStart('clock');
        minutesDial.setStart('clock');
        secondsDial.setStart('clock');
        button1.classList.add('active-button');
        button2.classList.remove('active-button');
    })
    document.getElementById('button2').addEventListener('click', function () {
        // timer
        hoursDial.setStart('timer');
        minutesDial.setStart('timer');
        secondsDial.setStart('timer');
        button1.classList.remove('active-button');
        button2.classList.add('active-button');
    })
    document.getElementById('button3').addEventListener('click', function () {
        // smooth
        console.log('działa');

        if (switcher) {
            switcher = false;
        } else {
            switcher = true;
        }
        window.requestAnimationFrame(drawLoop);
        return switcher;
    })
    document.getElementById('button4').addEventListener('click', function () {
        // reset timer
        hoursDial.setAngle('start');
        minutesDial.setAngle('start');
        secondsDial.setAngle('start');
        hoursDial.setStart('timer');
        minutesDial.setStart('timer');
        secondsDial.setStart('timer');
        timeOfWorkDial.setAngle('workstart');
    })


    window.addEventListener('load', function () {
        window.requestAnimationFrame(drawLoop);
    }, false);

    function drawLoop() {
        hoursDial.setAngle('end');
        minutesDial.setAngle('end');
        secondsDial.setAngle('end');
        timeOfWorkDial.setAngle('workend');
        context.clearRect(0, 0, canvas.width, canvas.height);
        hoursDial.draw();
        secondsDial.draw();
        minutesDial.draw();
        timeOfWorkDial.draw();
        window.requestAnimationFrame(drawLoop);
    }
})
