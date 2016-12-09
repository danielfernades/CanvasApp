import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { GlobalVars } from '../../providers/GlobalVars';
import { TabsPage } from '../tabs/tabs';

@Component({
  templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage {

  name: String[];
  email: String[];
  selectedItem: any;
  icons: string[];
  displayName: string;
  avatarImageUrl: string;
  bio: string;
  UserId: string;
  isExpand: boolean = false;
  shownBio: string;
  likes: any;
  posts: any;
  avatarImageUrls: any;
  likeArray: any;
  postArray: any;
  leader: any;
  LikesCount: any;
  PostsCount: any;



  constructor(private navCtrl: NavController, public GlobalVars: GlobalVars) {
  }

  onPageWillEnter() {
    console.log("onPageWillEnter");
    this.loadContent();
    this.LoadLikes();
  }


  LoadLikes() {
    this.likes = {}
    this.posts = {}
    this.avatarImageUrls = {}
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgu.instructure.com/api/v1/courses/" + this.GlobalVars.getCourseID() +
      "/discussion_topics?per_page=100&access_token=" + this.GlobalVars.getAccessToken(), false);
    xhr.send();
    if (xhr.status >= 200 && xhr.status <= 299) {
      var topicJSON = JSON.parse(xhr.response);
      for (let i = 0; i < topicJSON.length; i++) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://cgu.instructure.com/api/v1/courses/" + this.GlobalVars.getCourseID() +
          "/discussion_topics/" + topicJSON[i]['id'] + "/entries?per_page=100&access_token=" + this.GlobalVars.getAccessToken(), false);
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
      this.likeArray.push({ 'display_name': key, 'avatar_image_url': this.avatarImageUrls[key], 'like': this.likes[key] });
      console.log(key + '=' + this.likes[key])
    }
    console.log(' ')
    this.postArray = [];
    for (var key in this.posts) {
      this.postArray.push({ 'display_name': key, 'avatar_image_url': this.avatarImageUrls[key], 'post': this.posts[key] });
      console.log(key + '=' + this.posts[key])
    }
    this.LikesCount = this.likes[this.displayName];
    this.PostsCount = this.posts[this.displayName];
  }










  loadContent() {
    console.log("load");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgu.instructure.com/api/v1/users/self?access_token=" + this.GlobalVars.getAccessToken(), false);
    xhr.send();
    console.log("https://cgu.instructure.com/api/v1/users/self?access_token=" + this.GlobalVars.getAccessToken());
    console.log(xhr.status);
    console.log(xhr.statusText);
    console.log(xhr.response);

    var profile = JSON.parse(xhr.response);
    this.displayName = profile["name"];
    this.avatarImageUrl = profile["avatar_url"];
    this.UserId = profile["id"];

    console.log("load");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cgu.instructure.com/api/v1/users/" + this.UserId + "/profile/?access_token=" + this.GlobalVars.getAccessToken(), false);
    xhr.send();
    //console.log("https://cgu.instructure.com/api/v1/users/self?access_token=" + this.GlobalVars.getAccessToken());
    console.log(xhr.status);
    console.log(xhr.statusText);
    console.log(xhr.response);

    var profile = JSON.parse(xhr.response);
    this.displayName = profile["name"];
    this.avatarImageUrl = profile["avatar_url"];
    this.UserId = profile["id"];
    this.email = profile["primary_email"];
    this.bio = profile["bio"];
    // Email api https://cgu.instructure.com/api/v1/users/1355/profile/?access_token=
    this.shownBio = this.bio.substring(0, 25) + "...";

  }
  Expand() {
    if (this.isExpand == true) {
      this.shownBio = this.bio;
      this.isExpand = false;
    } else {
      this.shownBio = this.bio.substring(0, 25) + "...";
      this.isExpand = true;
    }

  }
}

