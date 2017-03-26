import {Routes} from "@angular/router";
import {SetlistSearchComponent} from "./setlist/search/setlist-search.component";
import {AuthenticationGuardService} from "./shared/service/authentication-guard/authentication-guard.service";
import {LoginComponent} from "./shared/component/login/login.component";
import {SetlistCreateComponent} from "./setlist/create/setlist-create.component";
import {SetlistUpdateComponent} from "./setlist/update/setlist-update.component";
import {SetlistResolver} from "./setlist/shared/resolver/setlist-resolver";
import {SheetSearchComponent} from "./sheet/search/sheet-search.component";

export const LISTS_URL = 'setlists';
export const SHEETS_URL = 'sheets';
export const LOGIN_URL = 'login';

export const routes:Routes = [
  {
    path: LISTS_URL,
    component: SetlistSearchComponent,
    canActivate: [AuthenticationGuardService]
  },
  {
    path: LISTS_URL + '/create',
    component: SetlistCreateComponent,
    canActivate: [AuthenticationGuardService]
  },
  {
    path: LISTS_URL + '/:id',
    component: SetlistUpdateComponent,
    canActivate: [AuthenticationGuardService],
    resolve: {setlist: SetlistResolver}
  },
  {
    path: SHEETS_URL,
    component: SheetSearchComponent,
    canActivate: [AuthenticationGuardService]
  },
  {
    path: LOGIN_URL,
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: SHEETS_URL,
    pathMatch: 'full'
  }
];
