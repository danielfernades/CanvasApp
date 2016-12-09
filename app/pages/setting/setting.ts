import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ProfilePage} from '../profile/profile';

@Component({
  templateUrl: 'build/pages/setting/setting.html'
})
export class SettingPage {
  constructor(private navCtrl: NavController) {

  }
  goToProfile() {
    console.log("test");
    //this.navCtrl.push(ProfilePage);
    this.navCtrl.push(ProfilePage, {
      //item: item
    });
  }
}
