import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { SqlLiteService } from './service/db/sql-lite.service';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [Network]
})
export class AppComponent {
  public appPages = [
    {
      title: 'Productos',
      url: '/productos',
      icon: 'wine'
    },
    {
      title: 'Cambios',
      url: '/cambios',
      icon: 'swap'
    },
    {
      title: 'Compras',
      url: '/compras',
      icon: 'basket'
    }
  ];

  constructor(
    private platform: Platform,
    public db: SqlLiteService,
    private splashScreen: SplashScreen,
    public toastController: ToastController,
    private network: Network,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    const config = {
      apiKey: 'AIzaSyAtBK4RPIUDXkbFNEVRVt7Q7HTWJBndLzA',
      authDomain: 'gastos-44096.firebaseapp.com',
      databaseURL: 'https://gastos-44096.firebaseio.com',
      projectId: 'gastos-44096',
      storageBucket: 'gastos-44096.appspot.com',
      messagingSenderId: '689050114237'
    };
    firebase.initializeApp(config);
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  networkOnConnect() {
    // watch network for a connection
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
          this.presentToast('we got a wifi connection, woohoo!.');
          /* this.geSync(); */
        }
      }, 3000);
    });
  }

  async geSync() {
    /* this.db.changeUsers('productos'); */
    /* this.db.markNoSync('productos'); */
    const pro: any[] = await this.db.selectNoSyn('productos');
    pro.forEach((produc) => {
      this.db.sendDataToFirebase(produc, 'productos', 'idproductos', produc.idproductos);
    });
    const precio: any[] = await this.db.selectNoSyn('productPrecio');
    pro.forEach((produc) => {
      this.db.sendDataToFirebase(precio, 'productPrecio', 'idprodPrecio', produc.idproductos);
    });
  }

  syncData() {
    /* this.geSync();
    const ref = firebase.database().ref('usersSyncproductos');
    const proSyn = [];
    ref.orderByChild('yordy').equalTo(null).once('value', (snapshot) => {
      let count = 0;
      console.log(snapshot);
      snapshot.forEach((childSnapshot) => {
        console.log(childSnapshot.key);
        count = count + 1;
      });
      this.presentToast('Sync number: ' + count);
    }); */
    this.syncDataGetAll();
  }

  syncDataGetAll() {
    this.geSync();
    const ref = firebase.database().ref('usersSyncproductos');
    const proSyn = [];
    ref.orderByChild('yordy').equalTo(true).once('value', (snapshot) => {
      let count = 0;
      snapshot.forEach((childSnapshot) => {
        const produ = firebase.database().ref('productos/' + childSnapshot.key );
        produ.on('value', (dataprod) => {
          console.log(dataprod.val());
          this.db.addProducto(dataprod.val(), dataprod.key).then((idSync) => {
            console.log('SAVE: ' + idSync);
          });
        });
        count = count + 1;
      });
      this.presentToast('Sync number: ' + count);
    });
    this.getproductPrecio();
  }

  getproductPrecio() {
    const ref = firebase.database().ref('usersSyncproductPrecio');
    const proSyn = [];
    ref.orderByChild('yordy').equalTo(true).once('value', (snapshot) => {
      let count = 0;
      snapshot.forEach((childSnapshot) => {
        const produ = firebase.database().ref('productPrecio/' + childSnapshot.key );
        produ.on('value', (dataprod) => {
          console.log(dataprod.val());
          this.db.addPrecio(dataprod.val(), dataprod.key).then((idSync) => {
            console.log('SAVE: ' + idSync);
          });
        });
        count = count + 1;
      });
      this.presentToast('Sync number: ' + count);
    });
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
