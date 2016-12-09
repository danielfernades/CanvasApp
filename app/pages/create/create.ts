import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EntriesPage} from '../entries/entries';
import {GlobalVars} from '../../providers/GlobalVars';

@Component({
  templateUrl: 'build/pages/create/create.html'
})
export class CreatePage {
  title:string = "";
  message:string = "";
  allowRating:boolean = true;

  constructor(private navCtrl: NavController, public globalVars: GlobalVars) {
  }

  createTopic(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://cgu.instructure.com/api/v1/courses/" + this.globalVars.getCourseID() + 
    "/discussion_topics?"+"title="+this.title+"&message="+this.message+"&allow_rating="+this.allowRating+"&access_token=" + this.globalVars.getAccessToken(), false);
    xhr.send();
    console.log(xhr.status);
    console.log(xhr.response);
    console.log(this.title);

    var topicJson = JSON.parse(xhr.response);

    var topic = {
          topicID: topicJson['id'],
          title: topicJson['title'],
          postedAt: new Date(topicJson['posted_at']).toLocaleString(),
          pinned: topicJson['pinned'],
          displayName: topicJson['author']['display_name'],
          avatarImageUrl: topicJson['author']['avatar_image_url'],
          discussionSubentryCount: topicJson['discussion_subentry_count'],
          message: topicJson['message'],
          allowRating: topicJson['allow_rating']
        };

    if(xhr.status==200){
      this.navCtrl.push(EntriesPage, {
        item: topic
      });
    }
  }
}
