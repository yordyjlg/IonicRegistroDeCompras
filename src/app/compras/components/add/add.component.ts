import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoServiceService } from '../../../productos/service/producto-service.service';
import { CambioService } from '../../../cambios/service/cambio.service';
import { ComprasService } from '../../service/compras.service';
import { ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  compraForm: FormGroup;
  public searchResult: any[] = [];
  public productoSelected: any;
  public cambioSelected: any;
  public montoCompra: any;
  public cantidad = 1;
  public submitAttempt = false;

  constructor(
      public modalController: ModalController,
      public prodS: ProductoServiceService,
      public cambioS: CambioService,
      public comprasS: ComprasService,
      private sanitizer: DomSanitizer,
      private loadingCtrl: LoadingController,
      public toastController: ToastController,
      private formBuilder: FormBuilder
      ) {
        this.cambioS.getCambios();
        this.compraForm = this.formBuilder.group({
          'monto' : [null, Validators.required],
          'cantidad' : [null, Validators.required],
          'cambio' : [null, Validators.required]
        });
       }

  ngOnInit() {
  }

  async save() {
    console.log(this.montoCompra);
    console.log(this.cambioSelected);
    console.log(this.productoSelected);
    if (!this.compraForm.valid || !this.productoSelected) {
      if (!this.productoSelected) {
        this.presentToast('Debe agregar un producto.');
      }
      return;
    }
    this.submitAttempt = true;
    const loader = await this.loadingCtrl.create();
    loader.present().then(() => {
      this.comprasS.addCompra(this.productoSelected.idproductos, this.cambioSelected, this.montoCompra, this.cantidad)
      .then(item => {
        console.log(item);
        loader.dismiss();
        this.montoCompra = '';
        this.productoSelected = null;
        this.presentToast('Compra guardada.');
        this.submitAttempt = false;
      }, (error) => {
        this.submitAttempt = false;
        loader.dismiss();
        this.presentToast('Ocurio un error al guardar.');
      });
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async onChangeSearch(e) {
    console.log(e.detail.value);
    if (e.detail.value !== '') {
      const response = await this.prodS.searchProducto(e.detail.value);
      this.searchResult = response;
      console.log(response);
    } else {
      this.searchResult = [];
    }
  }

  productoSelect(producto) {
    this.productoSelected = producto;
    this.searchResult = [];
  }

  getImage(base64File) {
    return this.sanitizer.bypassSecurityTrustUrl(base64File);
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
}
