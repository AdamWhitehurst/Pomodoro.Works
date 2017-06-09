import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';

declare var cordova: any;

@Component({
})

export class Alarm {
    private alarmUrl: string;
    private lastAudioId: string;

    constructor(
        private nativeAudio: NativeAudio,
        private storage: Storage
    ) {
        this.lastAudioId = 'assets/sounds/kitchen_timer.mp3';

        storage.get('alarm_url').then(
            function (value) {
                if (value) {
                    this.alarmUrl = value;
                }
                else {
                    console.error('alarm_url was null. Setting to default: assets/ sounds / kitchen_timer.mp3');
                    this.setUrl('assets/sounds/kitchen_timer.mp3');
                }
            }.bind(this),
            function (error) {
                this.alarmUrl = 'assets/sounds/kitchen_timer.mp3';
                console.error('get alarm_url failed: ' + error + '\nSetting to default: assets/ sounds / kitchen_timer.mp3');
            });
    }

    getUrl() {
        return this.alarmUrl;
    }

    setUrl(url: string) {
        if (url) {
            this.storage.set('alarm_url', url);
            this.alarmUrl = url;
        }
        else {
            console.error('setAlarmUrl failed: ' + url);
        }
    }

    startAlarm(url: string = this.alarmUrl) {
        this.stopAlarm(this.lastAudioId);

        this.nativeAudio.loop(url).then(function () {
            this.lastAudioId = url;
        }.bind(this), function (error) {
            console.error('startAlarm Error: ' + error + " Audio id: " + url);
            this.loadAndPlayTone(url);
        }.bind(this));
    }

    stopAlarm(url: string = this.alarmUrl) {
        this.nativeAudio.stop(url).then(function () { }, function (error) {
            console.error('stopAlarm Error: ' + error + " Audio id: " + url + '\n Attempting to stop last audio id');
            this.nativeAudio.stop(this.lastAudioId);
        }.bind(this));
    }

    loadAndPlayTone(url: string = this.alarmUrl) {
        this.nativeAudio.preloadComplex(url, url, 0.9, 1, 0).then(function () {
            this.startAlarm(url);
        }.bind(this), function (error) {
                console.error('loadAndPlayTone Error: ' + error);
                this.startAlarm(this.alarmUrl);
        }.bind(this));
    }
}