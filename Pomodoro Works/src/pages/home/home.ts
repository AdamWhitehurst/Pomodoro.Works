import { Component } from '@angular/core';
import { InAppBrowser, File } from 'ionic-native';
import { AlertController, NavController, ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from "@ionic-native/native-audio";
import { Timer } from "../../lib/timer";

declare var cordova: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    autoStartBreak: boolean;
    timer: Timer;

    timerContentElem;
    timeSelectorElem;
    endTimeElem;
    curTimeElem;
    stopButtonElem;
    alarmElem;
    tallyElem;
    notesElem;

    constructor(
        private plt: Platform,
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private localNotification: LocalNotifications,
        private nativeAudio: NativeAudio
    ) { }

    ionViewDidLoad() {
        // Initialize the timer
        this.timer = new Timer(this.localNotification, this.modalCtrl, this.nativeAudio);
        // Reference elements
        this.timeSelectorElem = document.getElementById('time-selector');
        this.timerContentElem = document.getElementById('timer-content');
        this.tallyElem = document.getElementById('tally');
        this.alarmElem = document.getElementById('alarm');
        this.stopButtonElem = document.getElementById('stop-button');
        this.endTimeElem = document.getElementById('end-time');
        this.curTimeElem = document.getElementById('current-time');
        this.notesElem = document.getElementById('notes');
        // Listen for changes to notes element
        this.notesElem.addeventListener('onchange', function () {
            this.saveNotes();
        }.bind(this));
        // Load Settings
        this.loadSettings();
    }

    loadSettings() {
        this.storage.get('autoBreakEnabled').then(
            function (value) {
                if (value) {
                    this.autoBreakEnabled = value;
                }
                else {
                    this.autoBreakEnabled = false;
                }
            }.bind(this)
        );
        if (this.notesElem) {
            this.storage.get('notes').then(
                function (value) {
                    console.warn("__ notes value __ " + value);
                    this.notesElem.text(value);
                }.bind(this)
            );
        }
    }

    presentCreditsAlert() {
        var popup = this.alertCtrl.create({
            title: 'Pomodoro.Works Timer App',
            subTitle: 'By Adam Whitehurst',
            message: '<p> Visit the main website:</br><a href="http://pomodoro.works/">Pomodoro.Works</a></br></br>Endless thanks to Sean Martz and the Coding Blocks Slack Community:</br><a href="http://codingblocks.slack.com/">CodingBlocks.Slack.com</a></p>',
            cssClass: 'credits-alert',
            buttons: ['OK']
        });
        popup.present();
    }

    selectRingtone() {
        this.timer.selectRingtone();
    }

    saveNotes() {
        if (this.notesElem) {
            this.storage.set('notes', this.notesElem.text());
        }
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
    }

    onCountdownDone() {
        this.timerContentElem.style.display = 'block';
        this.stopButtonElem.style.display = 'block';
        this.tallyElem.textContent = `POMODOROS FINISHED: ${GlobalSettings.count}`;
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

    onStopButtonClick() {
        this.timerContentElem.style.display = 'none';
        this.timer.clearAndCancelNotifications();
        this.stopAlarm();
    }

    stopAlarm() {
        this.timer.stopAlarm();

        if (this.autoStartBreak) {
            if (this.timer.count >= 4) {
                this.timer.count = 0;
                this.startCountdownTimer(1800, false);
            } else {
                this.startCountdownTimer(330, true);
            }
        }
    }

    openURL(url: string) {
        new InAppBrowser(url, '_self');
    }
}