import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-loading-message',
  templateUrl: 'loading-message.component.html'
})
export class LoadingMessageComponent implements OnInit {
  @Input() isLoading = false;

  constructor() {
  }

  ngOnInit() {
  }

}
