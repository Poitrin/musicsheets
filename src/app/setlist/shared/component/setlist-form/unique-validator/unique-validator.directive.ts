import {Directive, Input, forwardRef} from '@angular/core';
import {NG_VALIDATORS, Validator} from "@angular/forms";
import {FormControl} from '@angular/forms';
import {normalizeString} from "../setlist-form.component";

@Directive({
  selector: '[unique][ngModel]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => UniqueValidator), multi: true}
  ]
})
export class UniqueValidator implements Validator {
  @Input() unique;

  validate(formControl: FormControl) {
    function valueAlreadyExists(value, valueArray) {
      if (!valueArray || !value) {
        return false;
      }

      return valueArray.indexOf(normalizeString(value)) >= 0;
    }

    return valueAlreadyExists(formControl.value, this.unique) ? {unique: true} : null;
  }
}
