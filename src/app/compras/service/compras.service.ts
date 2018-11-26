import { Injectable } from '@angular/core';

import { SqlLiteService } from '../../service/db/sql-lite.service';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  public localCompras: any[] = [];

  constructor(public db: SqlLiteService) {
    this.getCompras();
   }

   public addCompra(idproductos: number, idcambios: number, monto: number, cantidad: number) {
    const sql = 'INSERT INTO compras (productosidproductos, cambiosidcambios, monto, cantidad, date) VALUES (?, ?, ?, ?, ?);';
    return this.db.insert(sql, [idproductos, idcambios, monto, cantidad, new Date()]).then((list) => {
      // update list of items, and then return the added list
      return this.getCompras().then(() => {
        return list;
      });
    });
  }

  public getCompras() {
    const sql = 'SELECT idcompras, compras.monto, compras.cantidad, compras.date AS dateCompra, productos.nombre AS nombreProd, ' +
                'productos.descripcion AS descripcionProd, cambios.usd, cambios.tasa FROM compras ' +
                'INNER JOIN productos ON productos.idproductos = compras.productosidproductos ' +
                'INNER JOIN cambios ON cambios.idcambios = compras.cambiosidcambios;';
    return this.db.executeSelect(sql, []).then((data: any) => {
      const compras: any[] = [];
      if (data) {
        for (const compra of data) {
          compras.push({
            idcompras: compra.idcompras,
            monto: compra.monto,
            cantidad: compra.cantidad,
            dateCompra: compra.dateCompra,
            nombreProd: compra.nombreProd,
            descripcionProd: compra.descripcionProd,
            usd: compra.usd,
            tasa: compra.tasa
          });
        }
      }
      console.log(compras);
      compras.sort((a, b) => {
        if (a.idcompras > b.idcompras) {
          return -1;
        }
        if (a.idcompras < b.idcompras) {
          return 1;
        }
        return 0;
      });
      this.localCompras = compras;
    });
  }
}
