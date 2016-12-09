import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EntriesPage} from '../entries/entries';
import {GlobalVars} from '../../providers/GlobalVars';
import { AlertController } from 'ionic-angular';
import { TopicsPage } from '../topics/topics';


@Component({
  templateUrl: 'build/pages/recommender/recommender.html'
})


export class RecommenderPage {
 
  topic: {
    topicID: string,
    title: string,
    message: string,
    postedAt: string,
    displayName: string,
    avatarImageUrl: string,
    allowRating: boolean
     };

  constructor(private navCtrl: NavController) {
    console.log("constructor");
  }

topicbackpage(page, item) {
    this.navCtrl.push(EntriesPage, {
         item: item
    });
}
}


  

