import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {RepliesPage} from '../replies/replies';
import {GlobalVars} from '../../providers/GlobalVars';
import { AlertController } from 'ionic-angular';
import {CreateReplyPage} from '../create-reply/create-reply';


@Component({
  templateUrl: 'build/pages/entries/entries.html'
})
export class EntriesPage {
  topic: {
    topicID: string,
    title: string,
    message: string,
    postedAt: string,
    displayName: string,
    avatarImageUrl: string,
    allowRating: boolean
  };
  entries: Array<{
    topicID: string,
    entryID: string,
    iD: string,
    message: string,
    createdAt: string,
    displayName: string,
    avatarImageUrl: string,
    replyCount: string,
    allowRating: boolean,
    ratingSum: string,
    rating: number
  }>;

  constructor(public navCtrl: NavController, navParams: NavParams, public globalVars: GlobalVars, public alertCtrl: AlertController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.topic = {
      topicID: navParams.get('item')['topicID'],
      title: navParams.get('item')['title'],
      message: navParams.get('item')['message'],
      postedAt: navParams.get('item')['postedAt'],
      displayName: navParams.get('item')['displayName'],
      avatarImageUrl: navParams.get('item')['avatarImageUrl'],
      allowRating: navParams.get('item')['allowRating']
    };
  }

  onPageWillEnter(){
    this.loadContent();
  }

  loadContent(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
      "/discussion_topics/" + this.topic.topicID + "/view?access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();
    var topicJson = JSON.parse(xhr.response);
    var ratedEntries = topicJson['entry_ratings'];


    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
      "/discussion_topics/" + this.topic.topicID + "/entries?access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();
    //console.log(xhr.status);
    //console.log(xhr.statusText);
    //console.log(xhr.response);    
    var entriesJson = JSON.parse(xhr.response);
    this.entries = []
    for (let i = entriesJson.length-1; i >= 0; i--) {
      let replyCount: string = "0";
      if(entriesJson[i].hasOwnProperty('recent_replies')){ 
        replyCount = entriesJson[i]['recent_replies'].length.toString();
      }
      let ratingSum: number;
      if(entriesJson[i]['rating_sum']==null){
        ratingSum = 0;
      }else{
        ratingSum = entriesJson[i]['rating_sum'];
      }
      let rating: number;
      if(ratedEntries.hasOwnProperty(entriesJson[i]['id'])){
        rating = ratedEntries[entriesJson[i]['id']];
      }else{
        rating = 0;
      }
      this.entries.push({
        topicID: this.topic['topicID'],
        entryID: entriesJson[i]['id'],
        iD: "",
        message: entriesJson[i]['message'],
        createdAt: new Date(entriesJson[i]['created_at']).toLocaleString(),
        displayName: entriesJson[i]['user']['display_name'],
        avatarImageUrl: entriesJson[i]['user']['avatar_image_url'],
        replyCount: replyCount,
        allowRating: this.topic.allowRating,
        ratingSum:ratingSum.toString(),
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
    if(item.rating==0){
      rating = 1;
    }else{
      rating = 0;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() + 
    "/discussion_topics/"+item.topicID+"/entries/"+item.entryID+"/rating?rating="+rating+"&access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();

    //Check if success (On success, the response will be 204 No Content with an empty body.)
    if(xhr.status==204 && xhr.response==""){
      //Change rating
      //item.rating = rating;
      this.loadContent();
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
    "/discussion_topics/"+ item.topicID + "/entries/"+ item.entryID + "?access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();

    console.log(xhr.status);
    console.log(xhr.response);

    if(xhr.status==204){//ok
      let alert = this.alertCtrl.create({
        title: 'The entry has been deleted',
        // subTitle: xhr.status.toString(),
        buttons: ['OK']
      });
      alert.present();

      this.loadContent();
    }else if(xhr.status==401){
      let alert = this.alertCtrl.create({
        title: 'Delete is not allowed',
        buttons: ['OK']
      });
      alert.present();
    }
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

      this.navCtrl.pop();
    }
  }

  replyClick(event, item){
     this.navCtrl.push(CreateReplyPage, {
      item: item
    });   
  }
}
