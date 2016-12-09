import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform  } from 'ionic-angular';
import {GlobalVars} from '../../providers/GlobalVars';
import {TabsPage} from '../tabs/tabs';

declare var window: any;

@Component({
    templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
    constructor(public navCtrl: NavController, private platform: Platform, public globalVars: GlobalVars) { //
    }

    //https://www.thepolyglotdeveloper.com/2016/01/using-an-oauth-2-0-service-within-an-ionic-2-mobile-app/
    public login() {
        this.platform.ready().then(() => {
            this.facebookLogin().then(success => {
                alert(success.code);
                //https://canvas.instructure.com/doc/api/file.oauth_endpoints.html#post-login-oauth2-token
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://cgu.instructure.com/login/oauth2/token?grant_type=authorization_code&client_id="+this.globalVars.getClientId()+"&client_secret="+this.globalVars.getClientSecret()+"&code="+success.code+"&redirect_uri="+this.globalVars.getRedirectUri()+"&state=YYY", false);
                xhr.send();
                var response = JSON.parse(xhr.response);
                this.globalVars.setAccessToken(response['access_token']);
                this.globalVars.setRefreshToken(response['refresh_token']);
                this.navCtrl.push(TabsPage, {
                    //item: item
                });
            }, (error) => {
                alert(error);
            });
        });
    }

    public facebookLogin(): Promise<any> {
        var clientId = this.globalVars.getClientId();
        var redirectUri = this.globalVars.getRedirectUri();
        return new Promise(function (resolve, reject) {
            var browserRef = window.cordova.InAppBrowser.open("https://cgu.instructure.com/login/oauth2/auth?client_id="+clientId+"&response_type=code&redirect_uri="+redirectUri+"&state=YYY", "_blank", "location=no");
            browserRef.addEventListener("loadstart", (event) => {
                if ((event.url).indexOf("http://localhost/callback") === 0) {
                    var responseParameters = ((event.url).split("?")[1]).split("&");
                    var parsedResponse = {};
                    for (var i = 0; i < responseParameters.length; i++) {
                        parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                    }
                    if (parsedResponse["code"] !== undefined && parsedResponse["code"] !== null) {
                        resolve(parsedResponse);
                    } else {
                        reject("Problem authenticating with Canvas");
                    }
                    browserRef.removeEventListener("exit", (event) => { });
                    browserRef.close();
                }
            });
            browserRef.addEventListener("exit", function (event) {
                reject("The Canvas sign in flow was canceled");
            });
        });
    }
}

