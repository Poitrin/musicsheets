import {Component, OnInit} from '@angular/core';
import {SetlistService} from "../shared/service/setlist/setlist.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Setlist} from "../shared/model/setlist/setlist";
import {LISTS_URL} from '../../routes';

@Component({
  selector: 'app-setlist-update',
  templateUrl: 'setlist-update.component.html'
})
export class SetlistUpdateComponent implements OnInit {
  public setlist;
  public isLoading = false;
  private _setlistId;

  constructor(private _setlistService: SetlistService,
              private _route: ActivatedRoute,
              private _router: Router) {
  }

  ngOnInit() {
    this._setlistId = this._route.snapshot.params['id'];
    this.read();
  }

  update() {
    this._setlistService.update(this._setlistId, this.setlist)
      .then(this.doAfterSuccess);
    this.isLoading = true;
  }

  private read() {
    this._route.data.subscribe((data:{setlist:Setlist}) => {
      this.setlist = data.setlist;
    });
  }

  private doAfterSuccess = () => {
    this._setlistService.refresh();
    this._router.navigate(['/' + LISTS_URL]);
  }
}
