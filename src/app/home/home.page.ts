import { Component } from '@angular/core';

import { SqlLiteService } from '../service/db/sql-lite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public db: SqlLiteService) {

  }

}
