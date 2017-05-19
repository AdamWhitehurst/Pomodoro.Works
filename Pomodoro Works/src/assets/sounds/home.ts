﻿import { Component } from '@angular/core';
import { InAppBrowser } from 'ionic-native';
import { NavController } from 'ionic-angular';
import { File } from 'ionic-native';
import { Alarm, RingtoneSelectModal } from "../../lib/alarm";
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';


declare var cordova: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    alarm;
    isBreak:boolean = false;
    countdown;
    counter: number = 0;

    timerContentElem;
    timeSelectorElem;
    endTimeElem;
    curTimeElem;
    stopButtonElem;
    alarmElem;
    tallyElem;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    }

    initAlarm() {
        this.alarm = new Alarm();
        this.alarm.getRingtones();
    }

    selectRingtone() {

        var tone;

        if (this.alarm.ringtones != 'undefined') {

            let modal = this.modalCtrl.create(RingtoneSelectModal, this.alarm.ringtones);

            modal.onDidDismiss(function (toneUrl) {
                this.alarm.setRingtone(toneUrl);
            }.bind(this));

            modal.present();
        }
    }

    startTimer(seconds: number, isBreak: boolean) {
        this.timeSelectorElem = document.getElementById('time-selector');
        this.timerContentElem = document.getElementById('timer-content');
        this.tallyElem = document.getElementById('tally');
        this.alarmElem = document.getElementById('alarm');
        this.stopButtonElem = document.getElementById('stop-button');
        this.endTimeElem = document.getElementById('end-time');
        this.curTimeElem = document.getElementById('current-time');

        clearInterval(this.countdown);

        const timeStart = Date.now();
        const timeEnd = timeStart + (seconds * 1000);

        this.countdown = setInterval(function () {
            const secondsLeft = Math.round((timeEnd - Date.now()) / 1000);
            if (secondsLeft <= 0) {
                if (!isBreak) {
                    this.counter++;
                }
                this.tallyElem.textContent = `POMODOROS FINISHED: ${this.counter}`

                this.stopTimer();
                this.playAlarm();

                return;
            }
            this.displayTimeLeft(secondsLeft);
        }.bind(this), 1000);

        this.timerContentElem.style.display = 'block';
        this.displayTimeLeft(seconds);
        this.displayEndTime(timeEnd);

    }

    stopTimer() {
        this.curTimeElem.textContent = 'No time selected';
        this.endTimeElem.textContent = 'grab a coffee';
        clearInterval(this.countdown);
    }

    displayTimeLeft(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = Math.round(seconds % 60);
        const display = `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
        this.curTimeElem.textContent = display;
        document.title = display;
    }

    displayEndTime(timestamp) {
        var q = new Date(timestamp);
        const hours = q.getHours();
        const minutes = q.getMinutes();
        this.endTimeElem.textContent = `End time: ${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }

    playAlarm() {
        this.timerContentElem.style.display = 'block';
        this.stopButtonElem.style.display = 'block';
        //this.alarmElem.play();
        this.alarm.playRingtone();
    }

    stopAlarm() {
        this.timerContentElem.style.display = 'none';
        this.stopButtonElem.style.display = 'none';
        this.alarm.stopRingtone();

        if (this.counter >= 4) {
            this.counter = 0;
            this.startTimer(1800, false);
        } else {
            this.startTimer(330, true);
        }
    }

    openURL(url: string) {
       new InAppBrowser(url, '_self');
    }
}