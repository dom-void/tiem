/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


document.addEventListener('DOMContentLoaded', function () {

    // taking seconds in actual 24h period from .getTime()
    var seconds = 1000;
    var minutes = seconds * 60;
    var hours = minutes * 60;
    var halfDays = hours * 12;
    var days = 2 * halfDays;

    var canvas = document.getElementById("clock");
    var context = canvas.getContext("2d");

    var switcher = true;

    function Time() {
        this.actualHours;
        this.actualMinutes;
        this.actualSeconds;
    }
    Time.prototype.timeGet = function () {
        var date = new Date();
        var timeZoneOffset = date.getTimezoneOffset() * minutes;
        var actualTime = date.getTime() - timeZoneOffset; // counting from 1 Jan 1970
        return actualTime;
    };
    Time.prototype.setTimeParameters = function () {
        var actualTime = this.timeGet();
        var fullDaysInActualTime = Math.floor(actualTime / halfDays) * halfDays;
        var daylySeconds = actualTime - fullDaysInActualTime;
        this.actualHours = (daylySeconds / hours).toFixed(2);
        this.actualMinutes = ((daylySeconds - Math.floor(this.actualHours) * hours) / minutes).toFixed(2);
        this.actualSeconds = ((daylySeconds - (Math.floor(this.actualHours) * hours + Math.floor(this.actualMinutes) * minutes)) / seconds).toFixed(2);
    };
    Time.prototype.getTimeValue = function (name) {
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
    };
    var time = new Time();

    var angleStart = -.5 * Math.PI;

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
    };
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
    };
    Dial.prototype.draw = function () {
        // this.angleStart = angleStart;
        // this.angleEnd = angleEnd;
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.innerRadius, this.angleStart, this.angleEnd, false);
        context.arc(this.centerX, this.centerY, this.outerRadius, this.angleEnd, this.angleStart, true);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    };

    var hoursColor = 'rgba(255,0,0,.7)';
    var minutesColor = 'rgba(0,0,255,.5)';
    var secondsColor = 'rgba(100,255,0,.5)';
    var workTimeColor = 'rgba(200,200,200,.9)';

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

    window.requestAnimationFrame = function () {
        if (switcher) {
            return function (callback) {
                window.setTimeout(callback, 1000 / 2);
            };
        } else {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        }
    }();

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
    });
    document.getElementById('button2').addEventListener('click', function () {
        // timer
        hoursDial.setStart('timer');
        minutesDial.setStart('timer');
        secondsDial.setStart('timer');
        button1.classList.remove('active-button');
        button2.classList.add('active-button');
    });
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
    });
    document.getElementById('button4').addEventListener('click', function () {
        // reset timer
        hoursDial.setAngle('start');
        minutesDial.setAngle('start');
        secondsDial.setAngle('start');
        hoursDial.setStart('timer');
        minutesDial.setStart('timer');
        secondsDial.setStart('timer');
        timeOfWorkDial.setAngle('workstart');
    });

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
});

/***/ })
/******/ ]);