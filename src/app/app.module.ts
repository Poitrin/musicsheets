import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {SetlistSearchComponent} from './setlist/search/setlist-search.component';
import {routes} from "./app.routes";
import {SetlistService} from "./setlist/shared/service/setlist/setlist.service";
import {AuthenticationComponent} from './shared/component/authentication/authentication.component';
import {AuthenticationService} from "./shared/service/authentication/authentication.service";
import {AuthenticationGuardService} from "./shared/service/authentication-guard/authentication-guard.service";
import {LoginComponent} from './shared/component/login/login.component';
import {SetlistCreateComponent} from './setlist/create/setlist-create.component';
import {SheetService} from "./shared/service/sheet/sheet.service";
import {LoadingMessageComponent} from './shared/component/loading-message/loading-message.component';
import {SetlistUpdateComponent} from './setlist/update/setlist-update.component';
import {SheetManagerComponent} from './setlist/shared/component/sheet-manager/sheet-manager.component';
import {SheetPipe} from './shared/pipe/sheet.pipe';
import {SetlistPipe} from './setlist/search/setlist.pipe';
import {SetlistFormComponent} from './setlist/shared/component/setlist-form/setlist-form.component';
import {UniqueValidator} from './setlist/shared/component/setlist-form/unique-validator/unique-validator.directive';
import {SetlistResolver} from "./setlist/shared/resolver/setlist-resolver";
import {SheetSearchComponent} from './sheet/search/sheet-search.component';
import {OrderByPipe} from './shared/pipe/order-by.pipe';
import {ReversePipe} from "./shared/pipe/reverse.pipe";
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    AppComponent,
    SetlistSearchComponent,
    AuthenticationComponent,
    LoginComponent,
    SheetManagerComponent,
    SetlistCreateComponent,
    LoadingMessageComponent,
    SetlistUpdateComponent,
    SheetPipe,
    SetlistPipe,
    SetlistFormComponent,
    UniqueValidator,
    SheetSearchComponent,
    OrderByPipe,
    ReversePipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    TranslateModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthenticationService,
    AuthenticationGuardService,
    SetlistService,
    SheetService,
    SetlistResolver
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
