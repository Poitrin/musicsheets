import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot} from "@angular/router";
import {AuthenticationService} from "../authentication/authentication.service";
import {LOGIN_URL} from '../../../routes';

@Injectable()
export class AuthenticationGuardService implements CanActivate {
  constructor(private _authenticationService: AuthenticationService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this._authenticationService.getIsSignedIn()
      .then((isSignedIn) => {
        if (!isSignedIn) {
          this.router.navigateByUrl('/' + LOGIN_URL);
        }

        return isSignedIn;
      })
  }
}
