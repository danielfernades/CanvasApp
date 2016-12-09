import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {GlobalVars} from '../../providers/GlobalVars';
import { AlertController } from 'ionic-angular';
import {CreateReplyPage} from '../create-reply/create-reply';


@Component({
  templateUrl: 'build/pages/replies/replies.html'
})
export class RepliesPage {
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
  replies: Array<{
    topicID: string,
    entryID: string,
    iD: string,
    message: string,
    createdAt: string,
    displayName: string,
    avatarImageUrl: string,
    replyCount: string,
    ratingSum: number,
    allowRating: boolean
    rating: number
  }>;

  constructor(public navCtrl: NavController, navParams: NavParams, public globalVars: GlobalVars, public alertCtrl: AlertController) {
    // If we navigated to this page, we will have an item available as a nav param
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

  onPageWillEnter() {
    this.loadContent();
  }

  loadContent() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
      "/discussion_topics/" + this.entry.topicID + "/view?access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();
    var topicJson = JSON.parse(xhr.response);
    var ratedEntries = topicJson['entry_ratings'];

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
      "/discussion_topics/" + this.entry['topicID'] + "/entries/" + this.entry['entryID'] + "/replies?access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();
    //console.log(xhr.status);
    //console.log(xhr.statusText);
    //console.log(xhr.response);    
    var entriesJson = JSON.parse(xhr.response);
    this.replies = []
    for (let i = entriesJson.length - 1; i >= 0; i--) {
      if (this.entry.iD == "" && entriesJson[i]['parent_id'] != this.entry.entryID) {
        continue;
      } else if (this.entry.iD != "" && entriesJson[i]['parent_id'] != this.entry.iD) {
        continue;
      }
      let replyCount: string = "0";
      let replyCountInt: number = 0;
      for (let j = entriesJson.length - 1; j >= 0; j--) {
        if (entriesJson[j]['parent_id'] == entriesJson[i]['id']) {
          replyCountInt++;
        }
      }
      replyCount = replyCountInt.toString();
      let ratingSum: number;
      if (entriesJson[i]['rating_sum'] == null) {
        ratingSum = 0;
      } else {
        ratingSum = entriesJson[i]['rating_sum'];
      }
      let rating: number;
      if (ratedEntries.hasOwnProperty(entriesJson[i]['id'])) {
        rating = ratedEntries[entriesJson[i]['id']];
      } else {
        rating = 0;
      }
      this.replies.push({
        topicID: this.entry['topicID'],
        entryID: this.entry['entryID'],
        iD: entriesJson[i]['id'],
        message: entriesJson[i]['message'],
        createdAt: new Date(entriesJson[i]['created_at']).toLocaleString(),
        displayName: entriesJson[i]['user']['display_name'],
        avatarImageUrl: entriesJson[i]['user']['avatar_image_url'],
        replyCount: replyCount,
        allowRating: this.entry.allowRating,
        ratingSum: ratingSum,
        rating: rating
      });
    }
  }

  itemTapped(event, entry) {
    this.navCtrl.push(RepliesPage, {
      item: entry
    });
  }

  likeClicked(event, item) {
    let rating: number;
    if (item.rating == 0) {
      rating = 1;
    } else {
      rating = 0;
    }
    let entryID: string;
    if (item.iD == "") { //entry
      entryID = item.entryID;
    } else { //reply
      entryID = item.iD;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
      "/discussion_topics/" + item.topicID + "/entries/" + entryID + "/rating?rating=" + rating + "&access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();

    //Check if success (On success, the response will be 204 No Content with an empty body.)
    if (xhr.status == 204 && xhr.response == "") {
      if (item.iD == "") { //entry
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
          "/discussion_topics/" + item.topicID + "/entries?" + "&access_token=" + this.globalVars.getAccessToken(), false);
        xhr.send();
        var entriesJson = JSON.parse(xhr.response);
        for (let i = entriesJson.length - 1; i >= 0; i--) {
          if (entriesJson[i]['id'] == item.entryID) {
            this.entry.ratingSum = entriesJson[i]['rating_sum'];
            this.entry.rating = rating;
          }
        }
      } else { //reply
        this.loadContent();
      }
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.loadContent();
      refresher.complete();
    })
  }

  deleteEntry(event, item) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
      "/discussion_topics/" + item.topicID + "/entries/" + item.entryID + "?access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();

    console.log(xhr.status);
    console.log(xhr.response);

    if (xhr.status == 204) {//ok
      let alert = this.alertCtrl.create({
        title: 'The entry has been deleted',
        // subTitle: xhr.status.toString(),
        buttons: ['OK']
      });
      alert.present();

      this.navCtrl.pop()
    } else if (xhr.status == 401) {
      let alert = this.alertCtrl.create({
        title: 'Delete is not allowed',
        buttons: ['OK']
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: xhr.status.toString(),
        buttons: ['OK']
      });
      alert.present();
    }
  }

  deleteReply(event, item) {
    var xhr = new XMLHttpRequest();
    // xhr.open("DELETE", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() + 
    // "/discussion_topics/"+ item.topicID + "/entries/"+ item.entryID + "/replies/" + item.iD +"?access_token=" + this.globalVars.getAccessToken(), false);
    xhr.open("DELETE", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
      "/discussion_topics/" + item.topicID + "/entries/" + item.iD + "?access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();

    console.log(xhr.status);
    console.log(xhr.response);

    if (xhr.status == 204) {//ok
      let alert = this.alertCtrl.create({
        title: 'The entry has been deleted',
        // subTitle: xhr.status.toString(),
        buttons: ['OK']
      });
      alert.present();

      this.loadContent();
    } else if (xhr.status == 401) {
      let alert = this.alertCtrl.create({
        title: 'Delete is not allowed',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  replyClick(event, item) {
    this.navCtrl.push(CreateReplyPage, {
      item: item
    });
  }
}
