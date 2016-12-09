import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {GlobalVars} from './providers/GlobalVars';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [GlobalVars]
})
export class MyApp {

  private rootPage: any;

  constructor(private platform: Platform, public globalVars: GlobalVars) {
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    if (app) {
      this.rootPage = LoginPage;
    } else {
      this.rootPage = TabsPage;
    }
    //http://stackoverflow.com/questions/8068052/phonegap-detect-if-running-on-desktop-browser
    

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp, [GlobalVars], {});
