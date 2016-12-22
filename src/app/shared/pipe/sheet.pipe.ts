import {Pipe, PipeTransform} from '@angular/core';
import {Sheet} from "../model/sheet/sheet";

@Pipe({
  name: 'sheet'
})
export class SheetPipe implements PipeTransform {

  transform(sheets: Sheet[], query: string): any {
    sheets = sheets || [];
    query = query || "";

    return sheets.filter((sheet: Sheet) => {
      let normalizedName = sheet.name.normalize('NFD').toLowerCase();
      let normalizedQuery = query.normalize('NFD').toLowerCase();

      return [normalizedName, ...sheet.tags].some(string => string.toLowerCase().indexOf(normalizedQuery) >= 0);
    });
  }

}
