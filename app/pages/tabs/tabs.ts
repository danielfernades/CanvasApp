import {Component} from '@angular/core';
import {TopicsPage} from '../topics/topics';
import {RecommenderPage} from '../recommender/recommender';
import {CreatePage} from '../create/create';
import {LeaderPage} from '../leader/leader';
import {SettingPage} from '../setting/setting';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;
  private tab5Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = TopicsPage;
    this.tab2Root = RecommenderPage;
    this.tab3Root = CreatePage;
    this.tab4Root = LeaderPage;
    this.tab5Root = SettingPage;
  }
}
