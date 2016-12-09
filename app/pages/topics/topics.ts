import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EntriesPage} from '../entries/entries';
import {GlobalVars} from '../../providers/GlobalVars';
import { AlertController } from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/topics/topics.html'
})
export class TopicsPage {
  selectedItem: any;
  icons: string[];
  allTopics: Array<{
    pinned: string,
    topics: Array<{
      topicID: string,
      title: string,
      postedAt: string,
      pinned: boolean,
      displayName: string,
      avatarImageUrl: string,
      discussionSubentryCount: string,
      message: string,
      allowRating: boolean
    }>
  }>;
  test:string;

  constructor(public navCtrl: NavController, public globalVars: GlobalVars, public alertCtrl: AlertController) {
    console.log("constructor");
  }

  onPageWillEnter(){
    console.log("onPageWillEnter");
    this.loadContent();
  }

  loadContent(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() + "/discussion_topics?access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();
    //console.log(xhr.status);
    //console.log(xhr.statusText);
    //console.log(xhr.response);    
    var topics = JSON.parse(xhr.response);

    this.allTopics = [];
    var pinnedTopics = [];
    var unpinnedTopics = [];
    for (let i = 0; i < topics.length; i++) {
        var topic = {
          topicID: topics[i]['id'],
          title: topics[i]['title'],
          postedAt: new Date(topics[i]['posted_at']).toLocaleString(),
          pinned: topics[i]['pinned'],
          displayName: topics[i]['author']['display_name'],
          avatarImageUrl: topics[i]['author']['avatar_image_url'],
          discussionSubentryCount: topics[i]['discussion_subentry_count'],
          message: topics[i]['message'],
          allowRating: topics[i]['allow_rating']
        };
      if (topics[i]['pinned'] == true) {
        pinnedTopics.push(topic);
      } else {
        unpinnedTopics.push(topic);
      }
    }
    this.allTopics = [{ pinned: "Pinned", topics: pinnedTopics }, { pinned: "Unpinned", topics: unpinnedTopics }];
  }

  itemTapped(event, item) {
    this.navCtrl.push(EntriesPage, {
      item: item
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.loadContent();
      // console.log('Pull to refresh complete!', refresher);
      // this.navCtrl.pop();
      // this.navCtrl.push(TopicsPage, {
      //   // item: this.topic
      // });
      refresher.complete();
    })
  }

  deleteTopic(event, item) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() + 
    "/discussion_topics/"+ item.topicID + "?access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();

    console.log(xhr.status);
    console.log(xhr.response);

    if(xhr.status==200){//ok

      let alert = this.alertCtrl.create({
        title: 'The topic has been deleted',
        // subTitle: 'The topic has been deleted',
        buttons: ['OK']
      });
      alert.present();

      this.loadContent();
    }
  }

  editTopic(event, item) {
    // var xhr = new XMLHttpRequest();
    // xhr.open("DELETE", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() + 
    // "/discussion_topics/"+ item.topicID + "?access_token=" + this.globalVars.getAccessToken(), false);
    // xhr.send();

    // console.log(xhr.status);
    // console.log(xhr.response);

    // if(xhr.status==200){//ok

    //   let alert = this.alertCtrl.create({
    //     title: 'The topic has been deleted',
    //     // subTitle: 'The topic has been deleted',
    //     buttons: ['OK']
    //   });
    //   alert.present();

    //   this.loadContent();
    // }
  }
}
