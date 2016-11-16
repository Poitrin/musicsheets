import {Component, OnInit} from '@angular/core';
import {SetlistService} from "../shared/service/setlist/setlist.service";
import {Router} from "@angular/router";
import {LISTS_URL} from "../../app.routes";

@Component({
  selector: 'app-setlist-create',
  templateUrl: 'setlist-create.component.html'
})
export class SetlistCreateComponent {
  public setlist = {sheets: []};
  public isLoading = false;

  constructor(private _setlistService: SetlistService,
              private _router: Router) {
  }

  create() {
    this._setlistService.create(this.setlist)
      .then(this.doAfterSuccess);
    this.isLoading = true;
  }

  private doAfterSuccess = () => {
    this._setlistService.refresh();
    this._router.navigate(['/' + LISTS_URL]);
  };
}
