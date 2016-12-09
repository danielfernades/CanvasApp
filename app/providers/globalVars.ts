import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars{
    courseID = "3208";
    accessToken = "1154~bSGwQVOGFCPhdx3ksR1megxYqglUjYX9ePTWF6eRouNgwH1nR28IuytNDlUTEWiE";
    refreshToken = "";
    clientId="11540000000000040";
    redirectUri="http://localhost/callback";
    clientSecret="TNUXMy1jIfBoxtUWLIAhVoAnGjvCrh8NxfGyUYKTUSzUDySsjvWHOpWL53qTcVEr";
    
    construture(){}

    setCourseID(value){
        this.courseID = value;
    }

    getCourseID(){
        return this.courseID;
    }

    setAccessToken(value){
        this.accessToken = value;
    }

    getAccessToken(){
        return this.accessToken;
    }

    setRefreshToken(value){
        this.refreshToken = value;
    }

    getRefreshToken(){
        return this.refreshToken;
    }

    setClientId(value){
        this.clientId = value;
    }

    getClientId(){
        return this.clientId;
    }

    setRedirectUri(value){
        this.redirectUri = value;
    }

    getRedirectUri(){
        return this.redirectUri;
    }


    setClientSecret(value){
        this.clientSecret = value;
    }

    getClientSecret(){
        return this.clientSecret;
    }
}

