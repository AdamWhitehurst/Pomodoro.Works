import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from '@ionic-native/native-audio';

declare var cordova: any;

@Component({
})

export class Alarm {
    private alarmUrl: string;
    private lastAudioId: string;

    constructor(
        private nativeAudio: NativeAudio
    ) {
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
        // Stop the previous alarm tone
        this.stopAlarm();

        // play new tone
        this.playTone(url).catch(
            // playTone failure
            function () {
                // Attempt load tone, then play tone again
                this.loadTone(url).then(
                    function () {
                        this.playTone(url)
                    }.bind(this),
                    function() {}
                )
            }.bind(this)
        );
    }

    stopAlarm(url: string = this.lastAudioId) {
        if (this.lastAudioId) {
            return this.nativeAudio.stop(url).catch(
                function (error) {
                    console.log('stopAlarm failed. ' + error);
                }
            );
        }
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