import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaisesService} from "../../services/paises.service";
import {Country, Pais} from "../../interfaces/region.interface";
import {startWith, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.scss']
})
export class SelectorPageComponent implements OnInit {

  // Llenar selectores
  regiones: string[] = []
  paises: Pais[] = [];
  // fronteras: string[] = [];
  fronteras: Pais[] = [];

  //UI
  cargando: boolean = false;

  miFormulario: FormGroup = this.fb.group({
    region: ['', [ Validators.required ]],
    pais: ['', [ Validators.required ]],
    frontera: ['', [Validators.required]]
  })

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    // this.obtenerRegiones();
    this.regiones = this.paisesService.regiones;

    // Cuando cambie la Region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap({
          next: ( _) => {
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
          }
        }),
        switchMap( region =>this.paisesService.getPaisesPorRegion( region )),
      ).subscribe({
      next: ( paises ) => {
        this.paises = paises;
        this.cargando = false;
      }
    })
    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          // this.fronteras = [];
          this.miFormulario.get('frontera')?.setValue('');
          this.cargando = true;
        }),
        switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo )),
        switchMap( pais =>  pais !== null ? this.paisesService.getPaisesPorCodigo( pais[0]?.borders ) : [])
      )
      .subscribe( (paises) => {
        console.log(paises)
        this.fronteras = paises;
        this.cargando = false;
        // if (pais) {
        //   if (pais[0].borders) {
        //     this.fronteras = pais[0].borders;
        //     console.log(pais[0].borders)
        //     this.cargando = false;
        //   } else {
        //     this.fronteras = [];
        //     this.cargando = false;
        //   }
        // }
      })
    // this.miFormulario.get('pais')?.valueChanges
    //   .pipe(
    //     tap({
    //       next: ( _ ) => {
    //         this.miFormulario.get('pais')?.reset('');
    //       }
    //     }),
    //     switchMap( pais => this.paisesService.getPaisPorCodigo( pais ))
    //   )
    //   .subscribe( frontera => {
    //     this.frontera = frontera;
    //     console.log('FRONTERA', frontera);
    //   })
    // this.miFormulario.get('region')?.valueChanges.
    // subscribe(region => {
    //       console.log(region);
    //       if ( region !== '') {
    //         this.paisesService.getPaisesPorRegion( region )
    //           .subscribe( paises => {
    //             this.paises = paises;
    //             console.log(paises);
    //           })
    //       } else {
    //         this.miFormulario.get('pais')?.setValue('');
    //         this.paises = []
    //       }
    //     })
  }

  guardar() {
    console.log(this.miFormulario.value);
  }

  obtenerRegiones() {
    if ( this.miFormulario.get('region')?.value !== '' ) {
      this.paisesService.getPaisesPorRegion( this.miFormulario?.get('region')?.value )
        .subscribe( region  => {
          this.paises = region;
        })
    } else {
      this.miFormulario.get('pais')?.setValue('');
      this.paises = [];
    }
  }

}
