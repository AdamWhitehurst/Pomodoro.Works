import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from '@ionic-native/native-audio';
declare var cordova: any;

@Component({
})

export class Alarm {
    public alarmUrl: string;

    constructor(
        private nativeAudio: NativeAudio
    ) {
        this.alarmUrl = 'assets/sounds/kitchen_timer_ding.mp3';
    }

    startAlarm(url: string = this.alarmUrl) {
        this.nativeAudio.loop(url).then(function () { }, function (error) {
            console.error('playAlarm Error: ' + error);
            this.loadAndPlayTone(url);
        }.bind(this));
    }

    stopAlarm(url: string = this.alarmUrl) {
        this.nativeAudio.stop(url).then(function () { }, function (error) {
            console.error('stopAlarm Error: ' + error);
        }.bind(this));
    }

    loadAndPlayTone(url: string = this.alarmUrl) {
        this.nativeAudio.preloadComplex(url, url, 0.9, 1, 0).then(function () {
            this.startAlarm(url);
        }.bind(this), function (error) {
            console.error('loadAndPlayTone Error: ' + error);
        }.bind(this));
    }
}