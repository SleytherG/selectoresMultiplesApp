import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {combineLatest, Observable, of} from "rxjs";
import {Country, Pais} from "../interfaces/region.interface";

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v3.1';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(
    private http: HttpClient
  ) { }

  getPaisesPorRegion( region: string): Observable<Pais[]> {
    const url: string = `${this._baseUrl}/region/${ region }`
    const httpParams = new HttpParams()
              .set('fields', 'cca2,name');
    return this.http.get<Pais[]>( url , { params: httpParams});
  }

  getPaisPorCodigo( codigo: string): Observable<Country[] | null> {
    if ( !codigo ) {
      return of(null)
    }
    const url: string = `${this._baseUrl}/alpha`;
    const httpParams = new HttpParams().set('codes', codigo);

    return this.http.get<Country[]>( url , { params: httpParams});
  }

  getPaisPorCodigoSmall( codigo: string): Observable<Pais> {

    const url: string = `${this._baseUrl}/alpha/${ codigo }`;
    const httpParams = new HttpParams().set('fields', 'name,cca2');

    return this.http.get<Pais>( url , { params: httpParams});
  }

  getPaisesPorCodigo( borders: string[] ): Observable<Pais[]> {
    if ( !borders ) {
      return of([]);
    }

    const peticiones: Observable<Pais>[] = [];

    borders.forEach( codigo => {
     const peticion = this.getPaisPorCodigoSmall( codigo );
     peticiones.push( peticion );
    });

    return combineLatest( peticiones );

  }

}
