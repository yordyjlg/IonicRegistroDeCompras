import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CambiosPage } from './cambios.page';
import { AddComponent } from './components/add/add.component';

const routes: Routes = [
  {
    path: '',
    component: CambiosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CambiosPage, AddComponent]
})
export class CambiosPageModule {}
