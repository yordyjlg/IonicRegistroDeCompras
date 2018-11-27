import { Injectable } from '@angular/core';
import { SqlLiteService } from '../../service/db/sql-lite.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoServiceService {
  localProduct: any[] = [];
  selectProduc: any = null;

  constructor(public db: SqlLiteService) {
    this.getProductos();
   }

   public addProducto(name: string, descripcion: string, image: string) {
    const sql = 'INSERT INTO productos ' +
    '(nombre, descripcion, image, remoteKey, sync, usersSync)' +
    ' VALUES (?, ?, ?, ?, ?, ?);';
    const prod = {
      id: 0,
      nombre: name,
      descripcion: descripcion,
      image: image,
      remoteKey: '',
      sync: 0,
      usersSync: 'yordy'
    };
    return this.db.insert(sql, [name, descripcion, image,
      prod.remoteKey, prod.sync, prod.usersSync]).then((id) => {
      // update list of items, and then return the added list
      prod.id = id;
      this.db.saveInfoToFirebase(prod, 'productos', 'idproductos', prod.id);
      return this.getProductos().then(() => {
        return id;
      });
    });
  }

  public addPrecio(productosidproductos, monto, tasa) {
    const sql = 'INSERT INTO productPrecio ' +
    '(productosidproductos, monto, tasa, date, remoteKey, sync, usersSync)' +
    ' VALUES (?, ?, ?, ?, ?, ?, ?);';
    const precio: any = {
      id: 0,
      productosidproductos: productosidproductos,
      monto: monto,
      tasa: tasa,
      date: new Date(),
      remoteKey: '',
      sync: 0,
      usersSync: 'yordy'
    };
    return this.db.insert(sql, [productosidproductos, monto, tasa, precio.date,
      '', 1, 'yordy']).then((id) => {
      // update list of items, and then return the added list
      precio.id = id;
      precio.date = precio.date.toISOString();
      this.db.saveInfoToFirebase(precio, 'productPrecio', 'productosidproductos', precio.id);
      return id;
    });
  }

  public updateProducto(idProd, prodt, operecion) {
    const sql = 'UPDATE productos SET ' +
    'nombre=?, descripcion=?, image=?, sync=?, usersSync=?, operacion=?' +
    ' WHERE idproductos=?;';
    return this.db.insert(sql, [prodt.nombre, prodt.descripcion, prodt.image,
      1, 'yordy', operecion, idProd]).then((id) => {
        return this.getProductos().then(() => {
          return id;
        });
    });
  }

  public getProductos() {
    return this.db.selectAll('productos').then((data: any) => {
      const localLists: any[] = [];
      if (data) {
        for (const prod of data) {
          localLists.push({
            idproductos: prod.idproductos,
            nombre: prod.nombre,
            descripcion: prod.descripcion,
            image: prod.image
          });
        }
      }
      this.localProduct = localLists;
      console.log(this.localProduct);
    });
  }

  selectAll(table: string, idPro) {
    return this.db.isReady()
    .then(() => {
      return this.db.database.executeSql(`SELECT * FROM ${table} ` +
      `WHERE (operacion IS NULL OR operacion NOT IN ('delete')) AND productosidproductos = ${idPro}`, [])
        .then((data) => {
          const lists = [];
          for (let i = 0; i < data.rows.length; i++) {
            lists.push(data.rows.item(i));
          }
          console.log(lists);
          return lists;
        });
    });
  }

  public getProductPrecio(idPro) {
    return this.selectAll('productPrecio', idPro).then((data: any) => {
      const localLists: any[] = [];
      if (data) {
        for (const prec of data) {
          localLists.push({
            idprodPrecio: prec.idprodPrecio,
            productosidproductos: prec.productosidproductos,
            monto: prec.monto,
            tasa: prec.tasa,
            date: prec.date
          });
        }
      }
      console.log(localLists);
      return localLists;
    });
  }

  public searchProducto(text: string) {
    return this.db.search('productos', 'nombre', text).then((data: any) => {
      const lists: any[] = [];
      if (data) {
        for (const prod of data) {
          lists.push({
            idproductos: prod.idproductos,
            nombre: prod.nombre,
            descripcion: prod.descripcion,
            image: prod.image
          });
        }
        console.log(lists);
        return lists;
      }
    });
  }
}
