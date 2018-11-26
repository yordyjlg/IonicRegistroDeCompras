import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComprasPage } from './compras.page';
import { AddComponent } from './components/add/add.component';
import { ProductoServiceService } from '../productos/service/producto-service.service';
import { CambioService } from '../cambios/service/cambio.service';

const routes: Routes = [
  {
    path: '',
    component: ComprasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ComprasPage, AddComponent],
  entryComponents: [AddComponent],
  providers: [
    ProductoServiceService,
    CambioService
  ]
})
export class ComprasPageModule {}
