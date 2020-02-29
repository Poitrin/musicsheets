import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {SetlistService} from "../../service/setlist/setlist.service";
import {Setlist} from "../../model/setlist/setlist";

@Component({
  selector: 'app-setlist-form',
  templateUrl: 'setlist-form.component.html',
  styleUrls: ['setlist-form.component.css']
})
export class SetlistFormComponent implements OnInit {
  @Input() isLoading;
  @Input() setlist: Setlist;

  @ViewChild('setlistForm', { static: true }) form;

  setlistNames: string[];

  constructor(private _setlistService: SetlistService) {
  }

  ngOnInit() {
    this.findAllSetlists();
  }

  private findAllSetlists() {
    this._setlistService.findAll()
      .then((setlists: Setlist[]) => {
        this.setlistNames = setlists
          .filter((setlist:Setlist) => {
            return setlist.id !== this.setlist.id;
          })
          .map(setlist =>
            normalizeString(setlist.name));
      });
  }
}

export function normalizeString(string: string) {
  return string
    .normalize('NFD')
    .toLowerCase()
    .replace(/\s/g, '')
}
