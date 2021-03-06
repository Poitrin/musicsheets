import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {SetlistService} from "../shared/service/setlist/setlist.service";
import {LoadingMessageComponent} from "../../shared/component/loading-message/loading-message.component";
import {Setlist} from "../shared/model/setlist/setlist";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-setlist-search',
  templateUrl: 'setlist-search.component.html'
})
export class SetlistSearchComponent implements OnInit, OnDestroy {
  public query;
  public setlists: Setlist[];
  private _translateServiceSubscription: Subscription;
  private CONFIRM_STRING;

  @ViewChild(LoadingMessageComponent, { static: true }) loadingMessage;

  constructor(private _setlistService: SetlistService,
              private _translateService: TranslateService) {
  }

  ngOnInit() {
    this.search();
    this._translateServiceSubscription = this._translateService.get('ARE_YOU_SURE_TO_DESTROY_THIS_SETLIST')
      .subscribe(string => this.CONFIRM_STRING = string);
  }

  ngOnDestroy() {
    this._translateServiceSubscription.unsubscribe();
  }

  destroy(setlist:Setlist) {
    let userWantsToDestroy = confirm(this.CONFIRM_STRING);
    if (userWantsToDestroy) {
      this._setlistService.destroy(setlist.id)
        .then(() => {
          this.setlists.splice(this.setlists.indexOf(setlist), 1);
          this.loadingMessage.isLoading = false;
        });
      this.loadingMessage.isLoading = true;
    }
  }

  private search() {
    this._setlistService.findAll()
      .then((setlists: Setlist[]) => {
        this.setlists = setlists;
        this.loadingMessage.isLoading = false;
      });
    this.loadingMessage.isLoading = true;
  }
}
