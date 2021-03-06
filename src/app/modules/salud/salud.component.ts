import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  CovidService,
  CovidData,
} from 'src/app/core/services/covid/covid.service';
import { SharedService } from 'src/app/core/Shared/shared.service';
import { WeatherService } from 'src/app/core/services/weather/weather.service';

import { Constants } from '../../Constants';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-salud',
  templateUrl: './salud.component.html',
  styleUrls: ['./salud.component.css'],
})
export class SaludComponent implements OnInit {
  public title1: string = 'Ventas';
  public labels1: string[] = [
    'Ventas descargadas',
    'Ventas en tienda',
    'Reporte de ventas',
  ];
  public data1 = [[350, 450, 100]];

  weather: any;
  country: string = '';
  countrySelected : any;

  todayCases: any;
  cases: any;
  activeCases: any;
  todayDeaths: any;
  totalDeaths: any;
  recoveredCases: any;
  testTotals: any;
  //pantalla de carga
  loading: boolean = true;
  //para las gráficas
  chart: any;
  //para las estadísticas
  paisesPrincipales: CovidData[] = [];

  Constants: any = Constants;

  @ViewChild('myChart') myChart: ElementRef;

  constructor(
    private covidService: CovidService,
    private sharedService: SharedService,
    private weatherService: WeatherService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.init();
  }

  getCountry() {
    this.countrySelected = Constants.countries.find(
      (c) => c.namea2 === localStorage.getItem('countryShort') )
    this.country = localStorage.getItem('countryShort') 
  }

  async init() {
    this.getCountry();

    this.todayCases = await this.covidService.getTodayCases( this.countrySelected.code );
    console.log(this.todayCases);
    
    
    this.cases = await this.covidService.getCases(  this.countrySelected.code );
    this.activeCases = await this.covidService.getActiveCases( this.countrySelected.code );
    this.recoveredCases = await this.covidService.getRecoveredCases( this.countrySelected.code );
    this.todayDeaths = await this.covidService.getTodayDeaths( this.countrySelected.code );
    this.totalDeaths = await this.covidService.getTotalDeaths( this.countrySelected.code );
    this.testTotals = await this.covidService.getTestTotals( this.countrySelected.code );
    
    setTimeout(() => {
      this.loading = false;
     }, 1000);
  }

  async getPaisesPrincipales() {
    let paises_p: string[] = ['USA', 'Mexico', 'Canada'];

    for (let i = 0; i < paises_p.length; i++) {
      let datosPais: CovidData = {
        country: paises_p[i],
        cases: 5,
        todayCases: 6,
        totalDeaths: 7,
      };
      /*
      //casos totales
      this.cases = await this.covidService.getCases(paises_p[i]);

      //casos de hoy
      this.todayCases = await this.covidService.getTodayCases(paises_p[i]);

      //muertes totales
      this.totalDeaths = await this.covidService.getTotalDeaths(paises_p[i]);
      */

      this.paisesPrincipales[i] = datosPais;
    }
  }
}
