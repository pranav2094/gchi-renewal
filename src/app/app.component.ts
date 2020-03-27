import { Component } from '@angular/core';
import { CommonMethodsService} from './common-methods.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public commonService: CommonMethodsService) {

  }
  title = 'gchi-renewal';
}
