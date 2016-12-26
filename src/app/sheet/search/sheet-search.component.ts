import {Component, OnInit, OnDestroy} from '@angular/core';
import {SheetService} from "../../shared/service/sheet/sheet.service";
import {Sheet} from "../../shared/model/sheet/sheet";
import {ViewChild} from "@angular/core/src/metadata/di";
import {SetlistService} from "../../setlist/shared/service/setlist/setlist.service";
import {Setlist} from "../../setlist/shared/model/setlist/setlist";
import {TranslateService} from "ng2-translate";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-sheet-search',
  templateUrl: 'sheet-search.component.html',
  styleUrls: ['sheet-search.component.css']
})
export class SheetSearchComponent implements OnInit, OnDestroy {
  public sheets: Sheet[];
  public _setlists: Setlist[];
  public SHEETS_DRIVE_FOLDER = environment.sheetsFolderId;

  private _translateServiceSubscription;
  private PROMPT_STRING;

  @ViewChild('sheetsLoadingMessage') loadingMessage;

  constructor(private _sheetService: SheetService,
              private _setlistService: SetlistService,
              private _translateService: TranslateService) {
  }

  ngOnInit() {
    this.findAllSheets();
    this.findAllSetlists();
    this._translateServiceSubscription = this._translateService.get('ADD_A_NEW_TAG')
      .subscribe(string => this.PROMPT_STRING = string)
  }

  ngOnDestroy() {
    this._translateServiceSubscription.unsubscribe();
  }

  refresh() {
    this._sheetService.refresh();
    this.findAllSheets();
  }

  getSetlistsForSheet(sheet: Sheet) {
    if (!this._setlists) {
      return [];
    }

    let setlistHasSheet = (setlist: Setlist) => {
      return setlist.sheets.some(_sheet => _sheet.id === sheet.id);
    };

    return this._setlists.filter(setlistHasSheet);
  }

  removeTag(sheet, tag) {
    sheet.tags.splice(sheet.tags.indexOf(tag), 1);
    this._sheetService.update(sheet.id, sheet)
      .then(() => {
        this.loadingMessage.isLoading = false;
      });
    this.loadingMessage.isLoading = true;
  }

  createTag(sheet) {
    let newTag = prompt(this.PROMPT_STRING);
    if (newTag && newTag.trim() != "") {
      sheet.tags.push(newTag);
      this._sheetService.update(sheet.id, sheet)
        .then(() => {
          this.loadingMessage.isLoading = false;
        });
      this.loadingMessage.isLoading = true;
    }
  }

  private findAllSheets() {
    this._sheetService.findAll()
      .then((sheets: Sheet[]) => {
        this.sheets = sheets;
        this.loadingMessage.isLoading = false;
      });
    this.loadingMessage.isLoading = true;
  }

  private findAllSetlists() {
    this._setlistService.findAll()
      .then((setlists: Setlist[]) => {
        this._setlists = setlists;
      });
  }
}
