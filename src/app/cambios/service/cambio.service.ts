import { Injectable } from '@angular/core';

import { SqlLiteService } from '../../service/db/sql-lite.service';

@Injectable({
  providedIn: 'root'
})
export class CambioService {
  public localCambios: any[] = [];

  constructor(public db: SqlLiteService) {
    this.getCambios();
   }

  public addCambio(usd: number, tasa: number, nota: string) {
    const sql = 'INSERT INTO cambios (usd, tasa, nota, date) VALUES (?, ?, ?, ?);';
    return this.db.insert(sql, [usd, tasa, nota, new Date()]).then((list) => {
      // update list of items, and then return the added list
      return this.getCambios().then(() => {
        return list;
      });
    });
  }

  public getCambios() {
    return this.db.selectAll('cambios').then((data: any) => {
      const cambios: any[] = [];
      if (data) {
        for (const cambio of data) {
          cambios.push({
            idcambios: cambio.idcambios,
            usd: cambio.usd,
            tasa: cambio.tasa,
            nota: cambio.nota,
            date: cambio.date
          });
        }
      }
      console.log(cambios);
      cambios.sort((a, b) => {
        if (a.idcambios > b.idcambios) {
          return -1;
        }
        if (a.idcambios < b.idcambios) {
          return 1;
        }
        return 0;
    });
    console.log(cambios);
      this.localCambios = cambios;
      return this.localCambios;
    });
  }
}
