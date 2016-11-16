import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {LoadingMessageComponent} from "../../../../shared/component/loading-message/loading-message.component";
import {SheetService} from "../../../../shared/service/sheet/sheet.service";
import {Setlist} from "../../model/setlist/setlist";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-sheet-manager',
  templateUrl: 'sheet-manager.component.html'
})
export class SheetManagerComponent implements OnInit {
  public sheets;
  public SHEETS_DRIVE_FOLDER = environment.sheetsDriveFolderId;

  @Input() setlist: Setlist;
  @ViewChild('sheetsLoadingMessage') sheetsLoadingMessage: LoadingMessageComponent;

  constructor(private _sheetService: SheetService) {
  }

  ngOnInit() {
    this.findAll();
  }

  add(sheet) {
    this.setlist.sheets.push(sheet);
  }

  remove(sheet) {
    let sheetIndex = this.setlist.sheets.indexOf(sheet);
    this.setlist.sheets.splice(sheetIndex, 1);
  }

  moveUp(index) {
    let sheets = this.setlist.sheets;
    let temp = sheets[index - 1];
    sheets[index - 1] = sheets[index];
    sheets[index] = temp;
  }

  moveDown(index) {
    let sheets = this.setlist.sheets;
    let temp = sheets[index + 1];
    sheets[index + 1] = sheets[index];
    sheets[index] = temp;
  }

  isOnSetlist(sheetToBeChecked) {
    if (!this.setlist || !this.setlist.sheets) {
      return false;
    }
    return this.setlist.sheets.some(sheet => sheet.id === sheetToBeChecked.id);
  }

  refresh() {
    this._sheetService.refresh();
    this.findAll();
  }

  private findAll() {
    this._sheetService.findAll()
      .then(sheets => {
        this.sheets = sheets;
        this.sheetsLoadingMessage.isLoading = false;
      });
    this.sheetsLoadingMessage.isLoading = true;
  }
}
