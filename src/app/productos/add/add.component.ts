import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductoServiceService } from '../service/producto-service.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [Camera, Crop, Base64]
})
export class AddComponent implements OnInit {
  public addForm: FormGroup;
  public nombre;
  public descripcion;
  public base64Image: any = '../../../assets/addimage.png';
  public base64ImageSave: any = '';
  public submitAttempt = false;

  constructor(private formBuilder: FormBuilder,
    private camera: Camera,
    private crop: Crop,
    private sanitizer: DomSanitizer,
    public prodS: ProductoServiceService,
    private loadingCtrl: LoadingController,
    public toastController: ToastController,
    private base64: Base64,
    public navCtrl: NavController) {
    this.addForm = this.formBuilder.group({
      'nombre' : [null, Validators.required],
      'descripcion' : [null, Validators.required]
    });
   }

  ngOnInit() {
    if (this.prodS.selectProduc) {
      this.nombre = this.prodS.selectProduc.nombre;
      this.descripcion = this.prodS.selectProduc.descripcion;
      this.base64Image = this.sanitizer.bypassSecurityTrustUrl(this.prodS.selectProduc.image);
      this.base64ImageSave = this.prodS.selectProduc.image;
    }
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     console.log(imageData);
     this.cropPicture(imageData);
     /* this.base64Image = 'data:image/jpeg;base64,' + imageData; */
    }, (err) => {
      console.log(err);
    });
  }

  cropPicture (fileUri) {
    console.log(fileUri);
    const options = {
      quality: 100,
      targetWidth: 400,
      targetHeight: 400
    };
    this.crop.crop(fileUri, options).then((imagePath) => {
      console.log(imagePath);
      this.base64.encodeFile(imagePath).then((base64File: string) => {
        console.log(base64File);
        this.base64ImageSave = base64File;
        this.base64Image = this.sanitizer.bypassSecurityTrustUrl(base64File);
      }, (err) => {
        console.log(err);
      });
    });
  }

  async addNuevoProducto(nombre, descripcion, image) {
    const loader = await this.loadingCtrl.create();
    loader.present().then(() => {
      this.prodS.addProducto(nombre, descripcion, image)
      .then(item => {
        console.log(item);
        loader.dismiss();
        this.submitAttempt = true;
        this.close();
      }, (error) => {
        this.submitAttempt = false;
        loader.dismiss();
        this.presentToast('Ocurio un error al guardar.');
      });
    });
  }

  async updateProducto() {
    const loader = await this.loadingCtrl.create();
    loader.present().then(() => {
      this.prodS.selectProduc.nombre = this.nombre;
      this.prodS.selectProduc.descripcion = this.descripcion;
      this.prodS.selectProduc.image = this.base64ImageSave;
      this.prodS.updateProducto(this.prodS.selectProduc.idproductos, this.prodS.selectProduc, 'modifi').then((id) => {
        console.log('modifi: ' + id);
        loader.dismiss();
        this.submitAttempt = true;
        this.close();
      }, (error) => {
        this.submitAttempt = false;
        loader.dismiss();
        this.presentToast('Ocurio un error al actualizar.');
      });
    });
  }

  save() {
    if (this.base64ImageSave === '') {
      this.presentToast('Debe seleccionar una imagen.');
    } else {
      if (this.prodS.selectProduc && this.prodS.selectProduc.idproductos) {
        this.updateProducto();
      } else {
        this.addNuevoProducto(this.nombre, this.descripcion, this.base64ImageSave);
      }
    }
  }

  close() {
    this.navCtrl.navigateBack('productos');
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }

  goToPrecios() {
    this.navCtrl.navigateForward('/productos/precios');
  }

}
