import {Pipe, PipeTransform} from '@angular/core';
import {Setlist} from "../shared/model/setlist/setlist";

@Pipe({
  name: 'setlist',
  pure: false
})
export class SetlistPipe implements PipeTransform {

  transform(setlists: Setlist[], query?: string): any {
    setlists = setlists || [];
    query = query || "";

    return setlists.filter(setlist => {
      let normalizedName = setlist.name.toLowerCase();
      let normalizedQuery = query.toLowerCase();
      return normalizedName.indexOf(normalizedQuery) >= 0;
    });
  }

}
