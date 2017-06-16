import { Storage } from '@ionic/storage';

class GlobalSettings {
    private static _instance;
    private _count: number = 0;
    private _alarmUrl: string = 'assets/sounds/kitchen_timer.mp3';
    private _reminderNotificationEnabled: boolean = false;

    private storage: Storage;

    constructor(storage: Storage) {
        if (!GlobalSettings._instance) {
            this.storage = storage;

            this.storage.get('reminderNotificationEnabled').then(
                function (value) {
                    if (value) {
                        this.reminderNotificationEnabled = value;
                    }
                    else {
                        this.reminderNotificationEnabled = false;
                    }
                }.bind(this)
            );

            this.storage.get('timerCountNum').then(
                function (value) {
                    if (value) {
                        this.timer.count = value;
                    }
                    else {
                        this.timer.count = 0;
                    }
                }
            );

            GlobalSettings._instance = this;
        }
    }

    public static get instance(): GlobalSettings {
        return GlobalSettings._instance;
    }

    get count() {
        return this._count;
    }

    set count(newCount: number) {
        this._count += newCount;
        this.storage.set('count', this._count);
    }

    get alarmUrl() {
        return this._alarmUrl;
    }

    set alarmUrl(newUrl: string) {
        this._alarmUrl = newUrl;
        this.storage.set('alarm_url', this._alarmUrl);
    }
}