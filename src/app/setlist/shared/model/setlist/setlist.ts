import {Sheet} from "../../../../shared/model/sheet/sheet";
export class Setlist {
  constructor(public id: string,
              public name: string,
              public dateCreated: string,
              public zipFileLink: string,
              public isRemovable: boolean,
              public owner: {
                email: string
                name: string
              },
              public sheets: Sheet[]) {
  }
}
