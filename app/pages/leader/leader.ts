import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GlobalVars} from '../../providers/GlobalVars';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/leader/leader.html'
})
export class LeaderPage {
  likes: any;
  posts: any;
  avatarImageUrls: any;
  likeArray: any;
  postArray: any;
  leader: any;

  constructor(public navCtrl: NavController, public globalVars: GlobalVars) {
    this.leader = "likes";
  }

  onPageWillEnter() {
    this.loadContent();
  }

  loadContent() {
    this.likes = {}
    this.posts = {}
    this.avatarImageUrls = {}
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
      "/discussion_topics?per_page=100&access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();
    if (xhr.status >= 200 && xhr.status <= 299) {
      var topicJSON = JSON.parse(xhr.response);
      for (let i = 0; i < topicJSON.length; i++) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() +
          "/discussion_topics/" + topicJSON[i]['id'] + "/entries?per_page=100&access_token=" + this.globalVars.getAccessToken(), false);
        xhr.send();
        if (xhr.status >= 200 && xhr.status <= 299) {
          var entryJSON = JSON.parse(xhr.response)
          for (let j = 0; j < entryJSON.length; j++) {
            if (this.posts.hasOwnProperty(entryJSON[j]['user']['display_name'])) {
              this.posts[entryJSON[j]['user']['display_name']] = this.posts[entryJSON[j]['user']['display_name']] + 1
            } else {
              this.posts[entryJSON[j]['user']['display_name']] = 1
            }
            if (this.likes.hasOwnProperty(entryJSON[j]['user']['display_name'])) {
              this.likes[entryJSON[j]['user']['display_name']] = this.likes[entryJSON[j]['user']['display_name']] + entryJSON[j]['rating_sum']
            } else {
              this.likes[entryJSON[j]['user']['display_name']] = entryJSON[j]['rating_sum']
            }
            if (!this.avatarImageUrls.hasOwnProperty(entryJSON[j]['user']['display_name'])) {
              this.avatarImageUrls[entryJSON[j]['user']['display_name']] = entryJSON[j]['user']['avatar_image_url']
            } 
            if (entryJSON[j].hasOwnProperty('recent_replies')) {
              for (let k = 0; k < entryJSON[j]['recent_replies'].length; k++) {
                if (this.posts.hasOwnProperty(entryJSON[j]['recent_replies'][k]['user']['display_name'])) {
                  this.posts[entryJSON[j]['recent_replies'][k]['user']['display_name']] = this.posts[entryJSON[j]['recent_replies'][k]['user']['display_name']] + 1
                } else {
                  this.posts[entryJSON[j]['recent_replies'][k]['user']['display_name']] = 1
                }
                if (this.likes.hasOwnProperty(entryJSON[j]['recent_replies'][k]['user']['display_name'])) {
                  this.likes[entryJSON[j]['recent_replies'][k]['user']['display_name']] = this.likes[entryJSON[j]['recent_replies'][k]['user']['display_name']] + entryJSON[j]['recent_replies'][k]['rating_sum']
                } else {
                  this.likes[entryJSON[j]['recent_replies'][k]['user']['display_name']] = entryJSON[j]['recent_replies'][k]['rating_sum']
                }
                if (this.avatarImageUrls.hasOwnProperty(entryJSON[j]['recent_replies'][k]['user']['display_name'])) {
                  this.avatarImageUrls[entryJSON[j]['recent_replies'][k]['user']['display_name']] = entryJSON[j]['recent_replies'][k]['user']['avatar_image_url']
                } 
              }
            }
          }
        }
      }
      this.callback()
    }
  }

  callback() {
    this.likeArray = [];
    for (var key in this.likes) {
      this.likeArray.push({'display_name':key,'avatar_image_url':this.avatarImageUrls[key],'like':this.likes[key]});
      console.log(key + '=' + this.likes[key])
    }
    console.log(' ')
    this.postArray = [];
    for (var key in this.posts) {
      this.postArray.push({'display_name':key,'avatar_image_url':this.avatarImageUrls[key],'post':this.posts[key]});
      console.log(key + '=' + this.posts[key])
    }
    console.log(this.likeArray)
    console.log(this.postArray)
    this.likeArray.sort(this.compareLike);
    this.postArray.sort(this.comparePost);
  }

  compareLike(a,b){
    if (a.like < b.like)
      return 1;
    if (a.like > b.like)
      return -1;
    return 0;    
  }

  comparePost(a,b){
    if (a.post < b.post)
      return 1;
    if (a.post > b.post)
      return -1;
    return 0;    
  }
}
