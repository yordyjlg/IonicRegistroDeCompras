import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductoServiceService } from './service/producto-service.service';

import { ProductosPage } from './productos.page';
import { AddComponent } from './add/add.component';
import { ListaPrecioComponent } from './lista-precio/lista-precio.component';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage
  },
  {
    path: 'add-product',
    component: AddComponent
  },
  {
    path: 'precios',
    component: ListaPrecioComponent
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
  declarations: [ProductosPage, AddComponent, ListaPrecioComponent],
  providers: [
    ProductoServiceService
  ]
})
export class ProductosPageModule {}
