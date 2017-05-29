import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from '@ionic-native/native-audio';
declare var cordova: any;

@Component({
})

export class Alarm {
    alarmUrl;

    constructor(
        public plt: Platform,
        public localNotifications: LocalNotifications
    ) {
        this.localNotifications.on('trigger', function(notification, state) {
            this.onAlarmTriggered(notification, state);
        }.bind(this));

        this.localNotifications.on('clear', function(notification, state) {
            this.clearAllNotifications();
        }.bind(this));

        this.alarmUrl = 'file://assets/sounds/kitchen_timer_ding.mp3';
    }

    setAlarmUrl(url: string) {
        this.alarmUrl = url;
    }

    startAlarm() {
        this.localNotifications.schedule({
            id: 0,
            title: 'Your Pomodoro Sprint is Over!',
            led: 'FF0000',
            sound: this.alarmUrl
        });
    }

    onAlarmTriggered(notification: any, state: any) {
        navigator.vibrate(1000);

        if (notification.id == 0) {
            this.localNotifications.schedule({
                id: 1,
                at: new Date(new Date().getTime() + 6000),
                title: 'Your Pomodoro Sprint is Over!',
                text: 'This is a reminder that your sprint is done.',
                led: 'FF0000',
                sound: this.alarmUrl
            });
        }
    }

    clearAllNotifications() {
       this.localNotifications.clearAll();
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
          <button ion-button color="secondary"><ion-icon name="musical-note" (click)="quickPlay(tone.Url)"></ion-icon> Play</button>
          <button ion-button color="secondary"><ion-icon name="checkmark" (click)="this.viewCtrl.dismiss(tone.Url)"></ion-icon> Select</button>
        </ion-note>
      </ion-item>
  </ion-list>
</ion-content>
`
})
export class RingtoneSelectModal {
    toneUrl: any; 

    onStatusUpdate = (status) => console.log(status);
    onSuccess = () => console.log('Action is successful.');
    onError = (error) => {
        console.error(error);
    }

    get ALARM_LIST() {
        return ALARM_LIST;
    }

    constructor(
        private platform: Platform,
        private params: NavParams,
        private viewCtrl: ViewController,
        private modalCtrl: ModalController,
        private nativeAudio: NativeAudio
    ) {}

    dismiss(toneUrl: string = 'undefined') {
      this.viewCtrl.dismiss(toneUrl);
    }

    quickPlay(url: string) {
        this.toneUrl = url; // Save a reference because how else do you pass this argument to the then function?

        this.nativeAudio.play(this.toneUrl).then(function () { }, function (error) {
            console.log('quickPlay: ' + error);
            this.loadAndPlayTone();
        }.bind(this));
    }
    loadAndPlayTone() {
        this.nativeAudio.preloadSimple(this.toneUrl, this.toneUrl).then(function () {
            this.quickPlay(this.toneUrl);
        }.bind(this), function (error) {
                console.log('loadAndPlay: ' + error);
        }.bind(this));
    }
}

export const ALARM_LIST: Array<any> = [
    // { Name: 'Phone Default', Url: 'res://platform_default'},
    { Name: 'Pomodoro', Url: 'assets/sounds/kitchen_timer_ding.mp3' },
    { Name: 'Train', Url: 'assets/sounds/railroad_crossing_bell.mp3' }
];