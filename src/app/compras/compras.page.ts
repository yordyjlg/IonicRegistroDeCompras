import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddComponent } from './components/add/add.component';
import { ComprasService } from './service/compras.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {
  public compras: any[] = [
    {
      nombre: 'Harina',
      Usd: 3,
      bs: 3,
      nota: 'Teste de una nota en el card',
      date:  new Date()
    }
  ];

  constructor(public modalController: ModalController,
    private sanitizer: DomSanitizer,
    public comprasS: ComprasService) { }

  ngOnInit() {
  }

  async showAddCompra() {
    const modal = await this.modalController.create({
      component: AddComponent,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

}

