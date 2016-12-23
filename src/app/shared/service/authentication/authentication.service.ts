import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";

const CLIENT_ID = environment.clientId;
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/script.storage',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/userinfo.email'
].join(' ');

declare var gapi: {
  auth2: {
    init: any,
    getAuthInstance(): any
  },
  currentUser: any,
  load: any,
  client: any,
  signIn(): Promise<any>,
  signOut(): Promise<any>
};

@Injectable()
export class AuthenticationService {
  private _auth2: {
    isSignedIn: any,
    currentUser: any,
    signIn(): Promise<any>,
    signOut(): Promise<any>
  };
  private _gapiAuthPromise;

  constructor() {
    this._gapiAuthPromise = new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        gapi.auth2.init({
          client_id: CLIENT_ID,
          scope: SCOPES
        }).then(() => {
          this._auth2 = gapi.auth2.getAuthInstance();
          resolve();
        })
      });
    });
  }

  signIn(): Promise<any> {
    return this._auth2.signIn();
  }

  signOut(): Promise<any> {
    return this._auth2.signOut();
  }

  /**
   * Returns a promise which - after having initialized the Google OAuth2 client -
   * says if the user is logged in or not.
   */
  getIsSignedIn(): Promise<any> {
    return this._gapiAuthPromise
      .then(() => this._auth2.isSignedIn.get());
  }

  getCurrentUserProfile(): Promise<any> {
    return this.getIsSignedIn()
      .then(isSignedIn =>
        (isSignedIn ? this._auth2.currentUser.get().getBasicProfile() : null));
  }
}
