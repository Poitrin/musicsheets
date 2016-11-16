import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Setlist} from "../model/setlist/setlist";
import {SetlistService} from "../service/setlist/setlist.service";
import {Injectable} from "@angular/core";

@Injectable()
export class SetlistResolver implements Resolve<Setlist> {
  constructor(private _setlistService: SetlistService) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Promise<Setlist> {
    return this._setlistService.read(route.params['id']);
  }
}
