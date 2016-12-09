import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {GlobalVars} from '../../providers/GlobalVars';
import {EntriesPage} from '../entries/entries';

/*
  Generated class for the CreateReplyPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/create-reply/create-reply.html',
})
export class CreateReplyPage {
  message: string = "";
  topic: {
    topicID: string,
    title: string,
    message: string,
    postedAt: string,
    displayName: string,
    avatarImageUrl: string,
    allowRating: boolean
  };
  entry: {
    topicID: string,
    entryID: string,
    iD: string,
    message: string,
    createdAt: string,
    displayName: string,
    avatarImageUrl: string,
    replyCount: string,
    ratingSum: number,
    allowRating: boolean,
    rating: number
  };

  constructor(private navCtrl: NavController, navParams: NavParams, public globalVars: GlobalVars) {
    if (!navParams.get('item').hasOwnProperty('entryID')) {
      this.topic = {
        topicID: navParams.get('item')['topicID'],
        title: navParams.get('item')['title'],
        message: navParams.get('item')['message'],
        postedAt: navParams.get('item')['postedAt'],
        displayName: navParams.get('item')['displayName'],
        avatarImageUrl: navParams.get('item')['avatarImageUrl'],
        allowRating: navParams.get('item')['allowRating']
      };
    } else {
      this.entry = {
        topicID: navParams.get('item')['topicID'],
        entryID: navParams.get('item')['entryID'],
        iD: navParams.get('item')['iD'],
        message: navParams.get('item')['message'],
        createdAt: navParams.get('item')['createdAt'],
        displayName: navParams.get('item')['displayName'],
        avatarImageUrl: navParams.get('item')['avatarImageUrl'],
        replyCount: navParams.get('item')['replyCount'],
        ratingSum: navParams.get('item')['ratingSum'],
        allowRating: navParams.get('item')['allowRating'],
        rating: navParams.get('item')['rating']
      };
    }
  }

  createReply() {
    var xhr = new XMLHttpRequest();

    if (this.topic!=null) {
      xhr.open("POST", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
        "/discussion_topics/" + this.topic.topicID + "/entries" + "?message=" + this.message+"&access_token=" + this.globalVars.getAccessToken(), false);
    } else {
      var entryID = "";
      if(this.entry.iD==""){
        entryID = this.entry.entryID;
      }else{
        entryID = this.entry.iD;
      }
      xhr.open("POST", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
        "/discussion_topics/" + this.entry.topicID + "/entries/"+ entryID + "/replies" +"?message=" + this.message + "&access_token=" + this.globalVars.getAccessToken(), false);
      console.log("https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
        "/discussion_topics/" + this.entry.topicID + "/entries/"+ entryID + "/replies" +"?message=" + this.message + "&access_token=" + this.globalVars.getAccessToken());
  }
    xhr.send();
    console.log(xhr.status);
    if (xhr.status > 200 && xhr.status < 299) {
      this.navCtrl.pop();
    }
  }

}
