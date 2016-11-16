import {Injectable} from '@angular/core';
import {GapiService} from "../../../../shared/service/gapi/gapi.service";
import {Setlist} from "../../model/setlist/setlist";

@Injectable()
export class SetlistService extends GapiService {
  private _setlists: Setlist[];
  private _setlistsPromise: Promise<Setlist[]>;

  constructor() {
    super('/setlists');
    if (this._setlistsPromise) { // FIXME: could this ever happen?
      console.warn("_setlistsPromise already initialized.");
      return;
    }
    this.initSetlistsDownload();
  }

  findAll(): Promise<Setlist[]> {
    return this._setlistsPromise;
  }

  read(id): Promise<Setlist> {
    return this.findAll()
      .then(setlists => setlists.find(setlist => setlist.id === id));
  }

  refresh(): void {
    this._setlists = null;
    this.initSetlistsDownload();
  }

  private initSetlistsDownload() {
    this._setlistsPromise = new Promise((resolve, reject) => {
      if (this._setlists) {
        // setlists are already available...
        resolve(this._setlists);
      } else {
        // download setlists and resolve Promise when finished.
        super.findAll()
          .then((setlists: Setlist[]) => {
            this._setlists = setlists;
            resolve(this._setlists);
          })
          .catch(reason => reject(reason));
      }
    });
  }

  download(id) {
    return this.makeApiCall(GapiService.HTTP_METHODS.GET, `${this._path}/${id}/download`, null)
  }
}
