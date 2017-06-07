import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RingtoneSelectModal } from "../lib/timer";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from '@ionic-native/native-audio';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        RingtoneSelectModal
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        RingtoneSelectModal
    ],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, LocalNotifications, NativeAudio]
})
export class AppModule { }
