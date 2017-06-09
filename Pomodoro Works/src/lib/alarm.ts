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
        storage.get('alarm_url').then(
            function (value) {
                if (value) {
                    this.alarmUrl = value;
                }
                else {
                    console.error('alarm_url was null. Setting to default: assets/sounds/kitchen_timer.mp3');
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
    }

    startAlarm(url: string = this.alarmUrl) {
        // Attempt to stop the previous alarm tone
        if (this.lastAudioId) {
            this.stopAlarm().catch(
                function (error) {
                    console.log('stopAlarm failed. ' + error);
                });
        }
        // play new tone
        this.playTone(url).catch(
            // playTone failure
            function () {
                // Attempt load tone, then play tone again
                this.loadTone(url).then(
                    function () {
                        this.playTone(url)
                    }.bind(this)
                )
            }.bind(this)
        );
    }

    stopAlarm(url: string = this.lastAudioId) {
        return this.nativeAudio.stop(url);
    }

    playTone(url: string) {
        return this.nativeAudio.loop(url).then(
            function () {
                this.lastAudioId = url;
            }.bind(this)
        );
    }

    loadTone(url: string) {
        if (!url) {
            throw new Error('Cannot load undefined tone! ' + url)
        }

        return this.nativeAudio.preloadComplex(url, url, 0.9, 1, 0);
    }
}