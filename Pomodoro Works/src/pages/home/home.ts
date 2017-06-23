import { Component } from '@angular/core';
import { InAppBrowser, File } from 'ionic-native';
import { AlertController, NavController, ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from "@ionic-native/native-audio";
import { Timer, RingtoneSelectModal } from "../../lib/timer";
import { Storage } from '@ionic/storage';
import { GlobalSettings, SettingsModal } from '../../lib/settings';

declare var cordova: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    autoStartBreak: boolean;
    timer: Timer;
    settings: GlobalSettings;

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
        private nativeAudio: NativeAudio,
        private storage: Storage
    ) {
        // Init Settings
        this.settings = new GlobalSettings(storage);
    }

    ionViewDidLoad() {
        // Initialize the timer
        this.timer = new Timer(this.localNotification, this.nativeAudio);
        // Reference elements
        this.timeSelectorElem = document.getElementById('time-selector');
        this.timerContentElem = document.getElementById('timer-content');
        this.tallyElem = document.getElementById('tally');
        this.tallyElem.textContent = `POMODOROS FINISHED: ${this.settings.tally}`;
        this.alarmElem = document.getElementById('alarm');
        this.stopButtonElem = document.getElementById('stop-button');
        this.endTimeElem = document.getElementById('end-time');
        this.curTimeElem = document.getElementById('current-time');
        this.notesElem = document.getElementById('notes');
        // Listen for changes to notes element
        this.notesElem.addEventListener('onchange', function () {
            this.saveNotes();
        }.bind(this));
    }

    presentAlert(name: string) {
        var popup;

        switch (name) {
            case 'credits':
                popup = this.alertCtrl.create({
                    title: 'Pomodoro.Works Timer App',
                    subTitle: 'By Adam Whitehurst',
                    message: '<p> Based on the work of Sean Martz. Visit the main website:</br><a href="http://pomodoro.works/">Pomodoro.Works</a></br></br>Endless thanks to Sean Martz and the Coding Blocks Slack Community:</br><a href="http://codingblocks.slack.com/">CodingBlocks.Slack.com</a></p>',
                    cssClass: 'credits-alert',
                    buttons: ['OK']
                });
                break;
        }

        popup.present();
    }

    presentModal(name: string) {
        var modal;

        switch (name) {
            case 'ringtones':
                modal = this.modalCtrl.create(RingtoneSelectModal, { alrm: this.timer.alarm });
                break;
            case 'settings':
                modal = this.modalCtrl.create(SettingsModal);
                break;

        }

        modal.present();
    }

    saveNotes() {
        if (this.notesElem) {
            this.settings.notes = this.notesElem.text();
        }
    }

    startCountdownTimer(seconds: number, isBreak: boolean) {
        if (this.timer) {
            const startTime = Date.now();
            const endTime = startTime + (seconds * 1000);

            this.endCountdown();
            this.timer.startCountdown(endTime, isBreak, this.onCountdownUpdate.bind(this), this.onCountdownDone.bind(this));
            this.displayTimerContent();
            this.displayTimeLeft(seconds);
            this.displayEndTime(endTime);
        }
    }

    endCountdown() {
        this.timerContentElem.style.display = 'none';
        this.timer.clearAndCancelNotifications();
        this.timer.stopAlarm();
    }

    onCountdownDone() {
        this.displayTimerContent();
    }

    onCountdownUpdate(seconds) {
        this.displayTimeLeft(seconds);
    }

    displayTimerContent() {
        this.timerContentElem.style.display = 'block';
        this.stopButtonElem.style.display = 'block';
        this.tallyElem.textContent = `POMODOROS FINISHED: ${this.settings.tally}`;
        this.displayTimeLeft(0);
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

    openURL(url: string) {
        new InAppBrowser(url, '_self');
    }
}