import { Component } from '@angular/core';
import { InAppBrowser, File } from 'ionic-native';
import { NavController, ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from "@ionic-native/native-audio";
import { Timer } from "../../lib/timer";
import { Storage } from '@ionic/storage';

declare var cordova: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    timer: Timer;

    timerContentElem;
    timeSelectorElem;
    endTimeElem;
    curTimeElem;
    stopButtonElem;
    alarmElem;
    tallyElem;

    constructor(
        private plt: Platform,
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private localNotification: LocalNotifications,
        private nativeAudio: NativeAudio,
        private storage: Storage
    ) { }

    ionViewDidLoad() {
        // Initialize the timer
        this.timer = new Timer(this.localNotification, this.modalCtrl, this.nativeAudio, this.storage);
        // Reference elements
        this.timeSelectorElem = document.getElementById('time-selector');
        this.timerContentElem = document.getElementById('timer-content');
        this.tallyElem = document.getElementById('tally');
        this.alarmElem = document.getElementById('alarm');
        this.stopButtonElem = document.getElementById('stop-button');
        this.endTimeElem = document.getElementById('end-time');
        this.curTimeElem = document.getElementById('current-time');
    }

    selectRingtone() {
        this.timer.selectRingtone();
    }

    startCountdownTimer(seconds: number, isBreak: boolean) {
        const startTime = Date.now();
        const endTime = startTime + (seconds * 1000);

        if (this.timer) {
            this.timer.startCountdown(endTime, isBreak, this.onCountdownUpdate.bind(this), this.onCountdownDone.bind(this));
            this.timerContentElem.style.display = 'block';
            this.displayTimeLeft(seconds);
            this.displayEndTime(endTime);
        }
        else {
            console.error("Timer not defined!");
        }

    }

    onCountdownDone() {
        this.timerContentElem.style.display = 'block';
        this.stopButtonElem.style.display = 'block';
        this.tallyElem.textContent = `POMODOROS FINISHED: ${this.timer.counter}`;
    }

    onCountdownUpdate(seconds) {
        this.displayTimeLeft(seconds);
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

    stopAlarm() {
        this.timerContentElem.style.display = 'none';

        if (this.timer.counter >= 4) {
            this.timer.counter = 0;
            this.startCountdownTimer(1800, false);
        } else {
            this.startCountdownTimer(330, true);
        }
    }

    openURL(url: string) {
        new InAppBrowser(url, '_self');
    }
}