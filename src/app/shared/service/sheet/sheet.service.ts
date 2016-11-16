import {Injectable} from '@angular/core';
import {GapiService} from "../gapi/gapi.service";
import {Sheet} from "../../model/sheet/sheet";

@Injectable()
export class SheetService extends GapiService {
  private _sheets: Sheet[];
  private _sheetsPromise: Promise<Sheet[]>;

  constructor() {
    super('/sheets');
    if (this._sheetsPromise) { // FIXME: could this ever happen?
      console.warn("_sheetsPromise already initialized.");
      return;
    }
    this.initSheetsDownload();
  }

  findAll(): Promise<Sheet[]> {
    return this._sheetsPromise;
  }

  refresh(): void {
    this._sheets = null;
    this.initSheetsDownload();
  }

  private initSheetsDownload() {
    this._sheetsPromise = new Promise((resolve, reject) => {
      // if sheets are already available...
      if (this._sheets) {
        return resolve(this._sheets);
      }

      // ... else download sheets and resolve Promise when finished.
      super.findAll()
        .then((sheets: Sheet[]) => {
          this._sheets = sheets;
          resolve(this._sheets);
        })
        .catch(reason => {
          reject(reason);
        });
    });
  }
}
