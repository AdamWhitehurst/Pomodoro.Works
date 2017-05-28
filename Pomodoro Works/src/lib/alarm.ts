import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from '@ionic-native/native-audio';
declare var cordova: any;

@Component({
})

export class Alarm {
    alarmUrls;
    alarmUrl;

    constructor(public plt: Platform, public localNotifications: LocalNotifications) {
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
                at: new Date(new Date().getTime() + 1000),
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
      <ion-item *ngFor="let tone of ringtones" (click)="quickPlay(tone.Url)">
        <ion-title>{{tone.Name}}</ion-title>
        <ion-note item-end>
          <button><ion-icon name="musical-note" (click)="quickPlay(tone.Url)"></ion-icon></button>
          <button><ion-icon name="checkmark" (click)="this.viewCtrl.dismiss(tone.Url)"></ion-icon></button>
        </ion-note>
      </ion-item>
  </ion-list>
</ion-content>
`
})
export class RingtoneSelectModal {
    ringtones: any;
    toneUrl: any; 

    onStatusUpdate = (status) => console.log(status);
    onSuccess = () => console.log('Action is successful.');
    onError = (error) => {
        console.error(error); if (error.message) console.error(error.message);
    }

    constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, private nativeAudio: NativeAudio) {
        this.ringtones = new Array();
        this.ringtones.push({ Name: 'test', Url: 'assets/sounds/kitchen_timer_ding.mp3' });
    }

    dismiss(toneUrl: string = 'undefined') {
      this.viewCtrl.dismiss(toneUrl);
    }

    quickPlay(url: string) {
        this.toneUrl = url;
        this.nativeAudio.preloadSimple(url, url).then(function () {
            console.log(this.toneUrl);
            this.nativeAudio.play(this.toneUrl);
        }.bind(this), function () {
            console.log(this.toneUrl);
            this.nativeAudio.play(this.toneUrl);
        }.bind(this));
    }
}