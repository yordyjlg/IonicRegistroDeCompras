import { Component, OnInit } from '@angular/core';
import { ProductoServiceService } from '../service/producto-service.service';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CambioService } from '../../cambios/service/cambio.service';

@Component({
  selector: 'app-lista-precio',
  templateUrl: './lista-precio.component.html',
  styleUrls: ['./lista-precio.component.scss'],
  providers: [CambioService]
})
export class ListaPrecioComponent implements OnInit {
  listaPrecio: any[] = [];
  lastCha = '';

  constructor(public prodS: ProductoServiceService,
    private loadingCtrl: LoadingController,
    public cambioS: CambioService,
    public toastController: ToastController,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.prodS.getProductPrecio(this.prodS.selectProduc.idproductos).then((data: any) => {
      console.log(data);
      this.listaPrecio = data;
    });
    this.cambioS.getCambios().then((data: any[]) => {
      console.log(data);
      if (data.length) {
        this.lastCha = data[data.length - 1].tasa;
      }
    });
  }

  async addNuevoPrecio(monto, tasa) {
    const loader = await this.loadingCtrl.create();
    loader.present().then(() => {
      this.prodS.addPrecio(this.prodS.selectProduc.idproductos, monto, tasa)
      .then(item => {
        console.log(item);
        this.prodS.getProductPrecio(this.prodS.selectProduc.idproductos).then((data: any) => {
          console.log(data);
          this.listaPrecio = data;
          loader.dismiss();
        });
      }, (error) => {
        loader.dismiss();
        this.presentToast('Ocurio un error al guardar.');
      });
    });
  }

  async showAddPrecio() {
    console.log('show add  cambio');
    const alert = await this.alertCtrl.create({
      header: 'Nuevo Cambio',
      inputs: [
        {
          name: 'precio',
          placeholder: 'Precio',
          type: 'number'
        },
        {
          name: 'Tasa',
          value: this.lastCha,
          placeholder: 'Tasa',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Add',
          handler: data => {
            const navTransition = alert.dismiss();
            navTransition.then(() => {
              if (data.precio !== '' && data.Tasa !== '') {
                this.addNuevoPrecio(data.precio, data.Tasa);
              } else {
                this.presentToast('Faltan campos por llenar');
              }
              console.log(data);
            });
          }
        }
      ]
    });

    await alert.present();
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
