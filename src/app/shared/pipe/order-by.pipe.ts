import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  pure: false
})
export class OrderByPipe implements PipeTransform {

  transform(array: Array<string>, attribute: string): Array<string> {
    if (!array) {
      return [];
    }

    if (!attribute) {
      return array;
    }

    array.sort((a: any, b: any) => {
      if (a[attribute] < b[attribute]) {
        return -1;
      } else if (a[attribute] > b[attribute]) {
        return 1;
      } else {
        return 0;
      }
    });

    return array;
  }
}
