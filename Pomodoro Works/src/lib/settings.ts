﻿import { Component } from "@angular/core";
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

export class GlobalSettings {
    private static _instance = null;

    private _tally: number = 0;
    private _alarmUrl: string = 'assets/sounds/kitchen_timer.mp3';
    private _notesText: string = 'NOTES AND STUFF';
    private _reminderNotificationEnabled: boolean = false;
    private _autoStartBreak: boolean = false;

    private storage: Storage;

    constructor(storage: Storage) {
        if (!GlobalSettings._instance) {
            this.storage = storage;

            this.storage.get('alarmUrl').then(
                function (value) {
                    if (value) {
                        this._alarmUrl = value;
                    }
                }.bind(this)
            );

            this.storage.get('tally').then(
                function (value) {
                    if (value) {
                        this._tally = value;
                    }
                }.bind(this)
            );

            this.storage.get('notesText').then(
                function (value) {
                    if (value) {
                        this._notes = value;
                    }
                }.bind(this)
            );

            this.storage.get('reminderNotificationEnabled').then(
                function (value) {
                    if (value) {
                        this._reminderNotificationEnabled = value;
                    }
                }.bind(this)
            );

            this.storage.get('autoStartBreak').then(
                function (value) {
                    if (value) {
                        this._autoStartBreak = value;
                    }
                }.bind(this)
            );

            GlobalSettings._instance = this;
        }
    }

    public static instance(): GlobalSettings {
        if (GlobalSettings._instance) return GlobalSettings._instance;
        else {
            console.error('No instance of Global Settings found!!');
        }
    }

    public get tally() {
        return this._tally;
    }

    public set tally(tally: number) {
        this._tally = tally;
        this.storage.set('count', this._tally);
    }

    public get alarmUrl() {
        return this._alarmUrl;
    }

    public set alarmUrl(newUrl: string) {
        this._alarmUrl = newUrl;
        this.storage.set('alarmUrl', this._alarmUrl);
    }

    public get notes() {
        return this._notesText;
    }

    public set notes(notesText: string) {
        this._notesText = notesText;
        this.storage.set('notesText', this._notesText);
    }

    public get reminderNotificationEnabled() {
        return this._reminderNotificationEnabled;
    }

    public set reminderNotificationEnabled(reminderNotificationEnabled: boolean) {
        this._reminderNotificationEnabled = reminderNotificationEnabled;
        this.storage.set('reminderNotificationEnabled', this._reminderNotificationEnabled);
    }

    public get autoStartBreak() {
        return this._reminderNotificationEnabled;
    }

    public set autoStartBreak(autoStartBreak: boolean) {
        this._autoStartBreak = autoStartBreak;
        this.storage.set('autoStartBreak', this._autoStartBreak);
    }
}

@Component({
    template: `
<ion-header>
  <ion-toolbar color="tertiary">
    <ion-title>
      Settings
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
  <ion-item>
    <ion-label>Auto-Start Break</ion-label>
    <ion-checkbox color="danger" checked="false"></ion-checkbox>
  </ion-item>
  <ion-item>
    <ion-label>Reminder Notification Enabled</ion-label>
    <ion-checkbox color="danger" checked="false"></ion-checkbox>
  </ion-item>
  <button ion-button color="light">Reset Tally</button>
</ion-content>
`
})
export class SettingsModal {
    private settings: GlobalSettings;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams
    ) {
        this.settings = GlobalSettings.instance();
    }

}
