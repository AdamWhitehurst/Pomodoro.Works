import { LocalNotifications } from '@ionic-native/local-notifications';
import { Component } from "@angular/core";
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { NativeAudio } from "@ionic-native/native-audio";
import { Alarm } from "./alarm";
declare var cordova: any;

@Component({
})

export class Timer {
    public counter: number = 0;
    private alarm: Alarm;
    private isBreak: boolean = false;
    private endTime;
    private updateCallback;
    private endCallback;
    private countdown;

    constructor(
        private localNotifications: LocalNotifications,
        private modalCtrl: ModalController,
        private nativeAudio: NativeAudio
    ) {
        this.alarm = new Alarm(nativeAudio);

        // Listen to notification events
        this.localNotifications.on('trigger', function (notification, state) {
            this.onAlarmTriggered(notification, state);
        }.bind(this));

        this.localNotifications.on('clear', function (notification, state) {
            this.onNotificationCleared();
        }.bind(this));

    }

    selectRingtone() {
        var modal = this.modalCtrl.create(RingtoneSelectModal, { alrm: this.alarm });
        modal.onDidDismiss(function (url) {
            this.alarm.alarmUrl = url;
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
                    this.counter++;
                }

                this.localNotifications.schedule({
                    id: 0,
                    icon: 'file://assets/icon/icon.png',
                    title: 'Your Pomodoro Sprint is Over!',
                    text: 'Your sprint is done. Take a break, you winner.',
                    led: 'FF0000'
                });
                this.playAlarm();
                this.endCallback();

                return;
            }
            this.updateCallback(secondsLeft);

        }.bind(this), 1000);
    }

    onAlarmTriggered(notification: any, state: any) {
        navigator.vibrate(1000);

        if (notification.id == 0) {
            this.localNotifications.schedule({
                id: 1,
                at: new Date(new Date().getTime() + 60000),
                icon: 'file://assets/icon/icon.png',
                title: 'Reminder: Your Pomodoro Sprint is Over!',
                text: 'This is a reminder that your sprint is done.',
                led: 'FF0000'
            });
        }
    }

    clearNotifications() {
        this.localNotifications.clearAll();
    }

    playAlarm(url: string) {
        this.alarm.startAlarm(url);
    }

    stopAlarm() {
        this.alarm.stopAlarm();
        clearInterval(this.countdown);
    }
}

@Component({
    template: `
<ion-header>
  <ion-toolbar>
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
<ion-content>
  <ion-list>
      <ion-item *ngFor="let tone of ALARM_LIST">
        <ion-title>{{tone.Name}}</ion-title>
        <ion-note item-end>
           <button ion-button color="secondary" (click)="this.viewCtrl.dismiss(tone.Url)"><ion-icon name="checkmark"></ion-icon> Select</button>
          <button ion-button color="secondary" (click)="quickPlay(tone.Url)"><ion-icon name="musical-note"></ion-icon> Play</button>
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

    quickPlay(url: string) {
        this.alarm.startAlarm(url);
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