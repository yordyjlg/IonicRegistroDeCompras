import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductoServiceService } from './service/producto-service.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  public selectedProducto: any = null;

  constructor(public navCtrl: NavController,
    public prodS: ProductoServiceService,
    private sanitizer: DomSanitizer,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
  }

  selectProducto(producto: any) {
    if (this.selectedProducto === producto) {
      this.clearSelectedProducto();
    } else {
      this.selectedProducto = producto;
    }
  }

  clearSelectedProducto() {
    this.selectedProducto = null;
  }

  getImage(base64File) {
    return this.sanitizer.bypassSecurityTrustUrl(base64File);
  }

  teste() {
    console.log('teste');
  }
  /* async addNuevoProducto(nombre, descripcion) {
    const loader = await this.loadingCtrl.create();
    loader.present().then(() => {
      this.prodS.addProducto(nombre, descripcion)
      .then(item => {
        console.log(item);
        loader.dismiss();
      }, error => loader.dismiss());
    });
  } */

  editProd(producto: any) {
    this.prodS.selectProduc = producto;
    this.navCtrl.navigateForward('/productos/add-product');
  }

  removeSelectedProducto() {
    console.log(this.selectedProducto);
    this.selectedProducto = null;
  }

  async removeProducto(producto: any) {
    console.log(producto);
    const alert = await this.alertCtrl.create({
      header: 'Confirme!',
      message: '¿Desea eliminar <strong>' + producto.nombre + '</strong>?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log(producto);
            this.prodS.updateProducto(producto.idproductos, producto, 'delete').then((id) => {
              console.log('delete: ' + id);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async showAddProducto() {
    console.log('show add  product');
    this.prodS.selectProduc = null;
    this.navCtrl.navigateForward('/productos/add-product');
    /* const alert = await this.alertCtrl.create({
      header: 'Nuevo producto',
      inputs: [
        {
          name: 'Nombre',
          placeholder: 'Nombre'
        },
        {
          name: 'Descripcion',
          placeholder: 'Descripcion'
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
              this.addNuevoProducto(data.Nombre, data.Descripcion);
            });
          }
        }
      ]
    });

    await alert.present(); */

  }

}
