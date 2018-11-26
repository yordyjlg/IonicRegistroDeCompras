import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { CambioService } from './service/cambio.service';

@Component({
  selector: 'app-cambios',
  templateUrl: './cambios.page.html',
  styleUrls: ['./cambios.page.scss'],
})
export class CambiosPage implements OnInit {
  public cambios: any[] = [];

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public cambioS: CambioService,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  async addNuevoCambio(usd, tasa, nota) {
    const loader = await this.loadingCtrl.create();
    loader.present().then(() => {
      this.cambioS.addCambio(usd, tasa, nota)
      .then(item => {
        console.log(item);
        loader.dismiss();
      }, error => loader.dismiss());
    });
  }

  async showAddCambio() {
    console.log('show add  cambio');
    const alert = await this.alertCtrl.create({
      header: 'Nuevo Cambio',
      inputs: [
        {
          name: 'Usd',
          placeholder: 'Usd',
          type: 'number'
        },
        {
          name: 'Tasa',
          placeholder: 'Tasa',
          type: 'number'
        },
        {
          name: 'Nota',
          placeholder: 'Nota'
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
              this.addNuevoCambio(data.Usd, data.Tasa, data.Nota);
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
