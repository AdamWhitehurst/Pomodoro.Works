import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

declare var cordova: any;

@Component({
})
export class Alarm {
    ringtone: string = "assets/sounds/kitchen_timer_ding";
    ringtones;
    play: boolean = false;

    setAlarmUrl(toneUrl: string) {
        if (toneUrl) {
            this.ringtone = toneUrl;
        }
    }

    getAlarmUrls() {
        cordova.plugins.NativeRingtones.getRingtone(
            function (success) {
              this.ringtones = success;
            }.bind(this),
            function (err) {
                alert(err);
            }.bind(this),
            'alarm');

        setTimeout(function () {}, 1000);
    }

    startAlarm() {
        this.play = true;
        this.loopAlarm();
    }

    loopAlarm() {
      cordova.plugins.NativeRingtones.playRingtone(this.ringtone);
      this.delay(2000).then(() => this.checkPlay());
    }

    delay(milliseconds: number) {
      return new Promise<void>(resolve => {
          setTimeout(resolve, milliseconds);
      });
    }

    checkPlay() {
        if (this.play) {
            this.loopAlarm();
        }
    }


    //loopAlarm() {
    //    this.checkPlay().then(function (result) {
    //        this.loopAlarm();
    //    }.bind(this));
    //}

    //checkPlay() {
    //    return new Promise(function (resolve, reject) {
    //        if (this.play) {
    //            setTimeout(function () {
    //                cordova.plugins.NativeRingtones.playRingtone(this.ringtone);
    //                resolve();
    //            }.bind(this), 2000);
    //        }
    //        else {
    //            reject();
    //        }
    //    });
    //}

    stopAlarm() {
        cordova.plugins.NativeRingtones.stopRingtone(this.ringtone);
        this.play = false;
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

    constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController) {
        this.ringtones = params.data;
    }

    dismiss(toneUrl: string = 'undefined') {
      this.viewCtrl.dismiss(toneUrl);
    }

    quickPlay(toneUrl: string) {
        cordova.plugins.NativeRingtones.playRingtone(toneUrl);
    }
}