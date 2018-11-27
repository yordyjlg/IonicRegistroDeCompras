import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SqlLiteService {

  public database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform: Platform, private sqlite: SQLite) {
    this.platform.ready().then(() => {
      console.log('create');
      this.sqlite.create({
        name: 'teste3.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;

          this.createTables().then(() => {
            // communicate we are ready!
            this.dbReady.next(true);
          });
        });
    });
  }

  private createTables() {
    return this.tableProductos()
      .then(() => {
        return this.tableCambios().then(() => {
          return this.tableCompras().then(() => {
            return this.tableMonedero().then(() => {
              return this.tableProductosPrecios();
            }).catch((err) => console.log('error detected creating tables', err));
          }).catch((err) => console.log('error detected creating tables', err));
        }).catch((err) => console.log('error detected creating tables', err));
      }).catch((err) => console.log('error detected creating tables', err));
  }

  private tableProductos() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS productos (
        idproductos INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        descripcion TEXT,
        image TEXT,
        remoteKey TEXT,
        sync INTEGER,
        usersSync TEXT,
        operacion TEXT
      );`, []);

      /*
      remoteKey TEXT, id remoto
      sync INTEGER, el estado del registro 0 si esta sincronizado o 1 si falta por sincronizar
      usersSync usuario que lo guardo o edito TEXT
      operacion: para saver que se va a hcaer con el registro, por ahora, las opciones so:
      delete,
      */
  }

  private tableProductosPrecios() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS productPrecio (
        idprodPrecio INTEGER PRIMARY KEY AUTOINCREMENT,
        productosidproductos INTEGER REFERENCES productos(idproductos),
        monto REAL,
        tasa REAL,
        date TEXT,
        remoteKey TEXT,
        sync INTEGER,
        usersSync TEXT,
        operacion TEXT
      );`, []);

      /*
      remoteKey TEXT, id remoto
      sync INTEGER, el estado del registro 0 si esta sincronizado o 1 si falta por sincronizar
      usersSync usuario que lo guardo o edito TEXT
      operacion: para saver que se va a hcaer con el registro, por ahora, las opciones so:
      delete,
      */
  }

  private tableCambios() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS cambios (
        idcambios INTEGER PRIMARY KEY AUTOINCREMENT,
        usd REAL,
        tasa REAL,
        nota TEXTL,
        date TEXT,
        remoteKey TEXT,
        sync INTEGER,
        usersSync TEXT,
        operacion TEXT
      );`, []);
      /*
      remoteKey TEXT, id remoto
      sync INTEGER, el estado del registro 0 si esta sincronizado o 1 si falta por sincronizar
      usersSync usuario que lo guardo o edito TEXT
      */
  }

  private tableCompras() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS compras (
        idcompras INTEGER PRIMARY KEY AUTOINCREMENT,
        productosidproductos INTEGER REFERENCES productos(idproductos),
        cambiosidcambios INTEGER REFERENCES cambios(idcambios),
        monto REAL,
        cantidad INTEGER,
        type TEXT,
        date TEXT,
        remoteKey TEXT,
        sync INTEGER,
        usersSync TEXT,
        operacion TEXT
      );`, []);
      /*
      remoteKey TEXT, id remoto
      sync INTEGER, el estado del registro 0 si esta sincronizado o 1 si falta por sincronizar
      usersSync usuario que lo guardo o edito TEXT
      */
  }

  private tableMonedero() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS monedero (
        idmonedero INTEGER PRIMARY KEY AUTOINCREMENT,
        saldo REAL,
        updatedate TEXT,
        remoteKey TEXT,
        sync INTEGER,
        usersSync TEXT,
        operacion TEXT
      );`, []);
      /*
      remoteKey TEXT, id remoto
      sync INTEGER, el estado del registro 0 si esta sincronizado o 1 si falta por sincronizar
      usersSync usuario que lo guardo o edito TEXT
      */
  }

  public isReady() {
    return new Promise((resolve, reject) => {
      // if dbReady is true, resolve
      if (this.dbReady.getValue()) {
        resolve();
      } else { // otherwise, wait to resolve until dbReady returns true
        this.dbReady.subscribe((ready) => {
          if (ready) {
            resolve();
          }
        });
      }
    });
  }

  selectAll(table: string) {
    return this.isReady()
    .then(() => {
      return this.database.executeSql(`SELECT * FROM ${table} WHERE operacion IS NULL OR operacion NOT IN ('delete')`, [])
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

  selectOneByProperty(table: string, property: string, value: any) {
    return this.isReady()
    .then(() => {
      return this.database.executeSql(`SELECT * FROM ${table} WHERE ${property} = ${value}`, [])
        .then((data) => {
          const lists = [];
          for (let i = 0; i < data.rows.length; i++) {
            lists.push(data.rows.item(i));
          }
          return lists;
        });
    });
  }

  search(table: string, property: string, value: string) {
    return this.isReady()
    .then(() => {
      const query = `SELECT * FROM ${table} WHERE (${property} LIKE ?)`;
      console.log(query);
      return this.database.executeSql(query, ['%' + value + '%'])
        .then((data) => {
          const lists = [];
          for (let i = 0; i < data.rows.length; i++) {
            lists.push(data.rows.item(i));
          }
          return lists;
        });
    });
  }

  executeSelect(query: string, values: any[]) {
    return this.isReady()
    .then(() => {
      console.log(query);
      return this.database.executeSql(query, values)
        .then((data) => {
          const lists = [];
          for (let i = 0; i < data.rows.length; i++) {
            lists.push(data.rows.item(i));
          }
          return lists;
        });
    });
  }

  insert(sql: string, values: any[]) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(sql, values)
          .then((result) => {
            if (result.insertId) {
              return result.insertId;
            }
          });
      });
  }

  delete(table: string, nameCulunId, idRegis) {
    return this.isReady()
    .then(() => {
      return this.database.executeSql(`DELETE FROM ${table} WHERE ${nameCulunId} = ${idRegis}`, [])
        .then((data) => {
          console.log(data);
          return data;
        });
    });
  }

  ifExist(tabla, remoteKey) {
    return this.isReady()
    .then(() => {
      return this.database.executeSql(`SELECT * FROM '${tabla}' WHERE remoteKey = '${remoteKey}'`, [])
        .then((data) => {
          const lists = [];
          for (let i = 0; i < data.rows.length; i++) {
            lists.push(data.rows.item(i));
          }
          return lists;
        });
    });
  }

  public addProducto(prod, remoteKey) {
    return this.ifExist('productos', remoteKey).then((data: any[]) => {
      console.log(data);
      if (!data.length) {
        const sql = 'INSERT INTO productos ' +
        '(nombre, descripcion, image, remoteKey, sync, usersSync, operacion)' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?);';
        return this.insert(sql, [prod.nombre, prod.descripcion, prod.image,
          remoteKey, 0, 'yordy', 'insert']).then((id) => {
            return id;
        });
      } else {
        return false;
      }
    });
  }

  public addPrecio(prod, remoteKey) {
    return this.ifExist('productPrecio', remoteKey).then((data: any[]) => {
      console.log(data);
      if (!data.length) {
        const sql = 'INSERT INTO productPrecio ' +
        '(productosidproductos, monto, tasa, date, remoteKey, sync, usersSync, operacion)' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
        return this.insert(sql, [prod.productosidproductos, prod.monto, prod.tasa, prod.date,
          remoteKey, 0, 'yordy', 'insert']).then((id) => {
            return id;
        });
      } else {
        return false;
      }
    });
  }

  /* ==================================== Syn ============================ */

  saveInfoToFirebase(data, tabla, nameCulunId, idRegis) {
    const newInfo = firebase.database().ref( tabla + '/').push();
    let sql = 'UPDATE ' + tabla + ' SET ' +
    'remoteKey=?, sync=? WHERE ' + nameCulunId + '=?;';
    console.log(newInfo.key);
    data.remoteKey = newInfo.key;
    this.insert(sql, [newInfo.key, 1, idRegis]).then((id) => {

      newInfo.set(data, (res) => {
        const usersSync = firebase.database().ref('usersSync' + tabla + '/' + newInfo.key);
        const user = {};
        user[data.usersSync] = true;
        usersSync.set(user, (userSync) => {
          console.log(res);
          sql = 'UPDATE ' + tabla + ' SET ' +
          'sync=? WHERE ' + nameCulunId + '=?;';
          this.database.executeSql(sql, [0, idRegis]).then((idSync) => {
            console.log('SAVE: ' + idSync);
            console.log(idRegis);
          }, (err) => {
            console.log(err);
          });
        });
      });
    });
  }

  updateInfoToFirebase(data, tabla, nameCulunId, idRegis) {
    const newInfo = firebase.database().ref( tabla + '/' + data.remoteKey);
    newInfo.update(data, (res) => {
      const usersSync = firebase.database().ref('usersSync' + tabla + '/' + data.remoteKey);
      const user = {};
      user[data.usersSync] = true;
      usersSync.set(user, (userSync) => {
        console.log(res);
        if (data.operacion === 'delete') {
          this.delete(tabla, nameCulunId, idRegis);
        } else {
          const sql = 'UPDATE ' + tabla + ' SET ' +
          'sync=? WHERE ' + nameCulunId + '=?;';
          this.database.executeSql(sql, [0, idRegis]).then((idSync) => {
            console.log('UPDATE: ' + idSync);
            console.log(idRegis);
          }, (err) => {
            console.log(err);
          });
        }
      });
    });
  }

  sendDataToFirebase(data, tabla, nameCulunId, idRegis) {
    if (data.remoteKey && data.remoteKey !== '' && data.remoteKey !== null && data.remoteKey !== 'null') {
      this.updateInfoToFirebase(data, tabla, nameCulunId, idRegis);
    } else {
      if (data.operacion === 'delete') {
        this.delete(tabla, nameCulunId, idRegis);
      } else {
        this.saveInfoToFirebase(data, tabla, nameCulunId, idRegis);
      }
    }
  }

  selectNoSyn(tabla): Promise<any> {
    return this.selectOneByProperty(tabla, 'sync', 1).then((data: any) => {
      return data;
    });
  }

  markNoSync(tabla) {
    const sql = 'UPDATE ' + tabla + ' SET ' +
      'sync=?;';
      this.insert(sql, [1]).then((idSync) => {
        console.log(idSync);
      });
  }

  changeUsers(tabla) {
    const sql = 'UPDATE ' + tabla + ' SET ' +
      'usersSync=?;';
      this.insert(sql, ['yordy']).then((idSync) => {
        console.log(idSync);
      });
  }

  /* addProducto(name: string, descripcion: string) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`INSERT INTO productos
        (name, descripcion) VALUES (?, ?);`,
          [name, descripcion])
          .then((result) => {
            if (result.insertId) {
              return this.getProducto(result.insertId);
            }
          });
      });
  } */
}
