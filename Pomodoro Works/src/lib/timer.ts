/// <reference path="settings.ts" />

import { GlobalSettings } from './settings';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Component } from "@angular/core";
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { NativeAudio } from "@ionic-native/native-audio";
import { Alarm } from "./alarm";
declare var cordova: any;

@Component({
})

export class Timer {
    private alarm: Alarm;
    private isBreak: boolean = false;
    private endTime;
    private updateCallback;
    private endCallback;
    private countdown;
    private settings;

    constructor(
        private localNotifications: LocalNotifications,
        private modalCtrl: ModalController,
        private nativeAudio: NativeAudio
    ) {
        this.settings = GlobalSettings.instance();
        this.alarm = new Alarm(nativeAudio, this.settings.alarmUrl);

        // Listen to notification events
        this.localNotifications.on('trigger', function (notification, state) {
            this.onNotificationTriggered(notification, state);
        }.bind(this));

        this.localNotifications.on('clear', function (notification, state) {
            this.onNotificationCleared();
        }.bind(this));

    }

    selectRingtone() {
        var modal = this.modalCtrl.create(RingtoneSelectModal, { alrm: this.alarm });
        modal.onDidDismiss(function (url) {
            this.alarm.stopAlarm();
            this.alarm.setUrl(url);
        }.bind(this));
        modal.present();
    }

    startCountdown(endTime: number, isBreak: boolean, updateCallback, endCallback) {
        this.endTime = endTime;
        this.updateCallback = updateCallback;
        this.endCallback = endCallback;
        this.isBreak = isBreak;

        this.stopAlarm();

        this.countdown = setInterval(function () {
            const secondsLeft = Math.round((this.endTime - Date.now()) / 1000);

            if (secondsLeft <= 0) {
                clearInterval(this.countdown);

                if (!this.isBreak) {
                    this.settings.count++;
                }

                this.localNotifications.schedule({
                    id: 0,
                    icon: 'file://assets/icon/icon.png',
                    title: 'Your Pomodoro Sprint is Over!',
                    text: 'Your sprint is done. Take a break, you winner.',
                    sound: this.alarm.getUrl(),
                    led: 'FF0000'
                });

                this.playAlarm();
                this.endCallback();

                return;
            }
            this.updateCallback(secondsLeft);

        }.bind(this), 1000);
    }

    onNotificationTriggered(notification: any, state: any) {
        navigator.vibrate(1000);

        if (notification.id == 0 && this.settings.reminderNotificationEnabled) {
            this.localNotifications.schedule({
                id: 1,
                at: new Date(new Date().getTime() + 60000),
                icon: 'file://assets/icon/icon.png',
                title: 'Reminder: Your Pomodoro Sprint is Over!',
                text: 'This is a reminder that your sprint is done.',
                sound: this.alarm.getUrl(),
                led: 'FF0000'
            });
        }
    }

    clearAndCancelNotifications() {
        this.localNotifications.cancelAll();
        this.localNotifications.clearAll();
    }

    onNotificationCleared() {
        this.clearAndCancelNotifications();
    }

    playAlarm(url: string) {
        this.alarm.startAlarm(url);
    }

    stopAlarm() {
        this.alarm.stopAlarm();
    }
}

@Component({
    template: `
<ion-header>
  <ion-toolbar color="tertiary">
    <ion-title>
      Select a Ringtone
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="this.viewCtrl.dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content color="secondary">
  <ion-list>
      <ion-item color="secondary" *ngFor="let tone of ALARM_LIST">
        <ion-title><h2 style="color: #ffffff;">{{tone.Name}}</h2></ion-title>
        <ion-note item-end>
          <button ion-button color="blue" (click)="this.viewCtrl.dismiss(tone.Url)"><ion-icon color="white" name="checkmark"> Select</ion-icon> </button>
          <button ion-button color="green" (click)="play(tone.Url)"><ion-icon color="white" name="musical-note"> Play</ion-icon> </button>
          <button ion-button color="danger" (click)="stop(tone.Url)"><ion-icon color="white" name="close"> Stop</ion-icon> </button>
        </ion-note>
     </ion-item>
  </ion-list>
</ion-content>
`
})
export class RingtoneSelectModal {
    private alarm: Alarm;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams
    ) {
        this.alarm = navParams.get('alrm');
    }

    play(url: string) {
        this.alarm.startAlarm(url);
    }

    stop(url: string) {
        this.alarm.stopAlarm();
    }

    get ALARM_LIST() {
        return ALARM_LIST;
    }
}

export const ALARM_LIST: Array<any> = [
    // { Name: 'Phone Default', Url: 'res://platform_default'},
    { Name: 'Kitchen Timer', Url: 'assets/sounds/kitchen_timer.mp3' },
    { Name: 'Cuckoo', Url: 'assets/sounds/cuckoo.mp3' },
    { Name: 'Digital', Url: 'assets/sounds/digital.mp3' },
    { Name: 'Falling Bomb', Url: 'assets/sounds/falling_bomb.mp3' },
    { Name: 'Police Car', Url: 'assets/sounds/police_car.mp3' },
    { Name: 'Rooster', Url: 'assets/sounds/rooster.mp3' },
    { Name: 'Train (Long!)', Url: 'assets/sounds/railroad_crossing_bell.mp3' }
];