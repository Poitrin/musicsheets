import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {LOGIN_URL} from "../../../app.routes";

@Component({
  selector: 'app-authentication',
  templateUrl: 'authentication.component.html'
})
export class AuthenticationComponent implements OnInit {
  public isSignedIn = null;
  public currentUserProfile = null;

  constructor(private _authenticationService: AuthenticationService,
              private _router: Router,
              private _zone: NgZone) {
  }

  ngOnInit() {
    this._authenticationService.getIsSignedIn()
      .then(isSignedIn => this.isSignedIn = isSignedIn);
    this.getCurrentUserProfile();
  }

  signIn() {
    this._authenticationService.signIn()
      .then(() => {
        this._zone.run(() => {
          this.isSignedIn = true;
          this.getCurrentUserProfile();
          this._router.navigateByUrl('/');
        });
      })
  }

  signOut() {
    this._authenticationService.signOut()
      .then(() => {
        this._zone.run(() => {
          this.isSignedIn = false;
          this.currentUserProfile = null;
          this._router.navigate([LOGIN_URL]);
        })
      })
  }

  getCurrentUserProfile() {
    this._authenticationService.getCurrentUserProfile()
      .then(currentUserProfile => this.currentUserProfile = currentUserProfile);
  }
}
