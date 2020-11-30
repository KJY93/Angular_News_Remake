import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CountriesList } from '../models';
import { NewsDatabase } from '../news.database';
import { Router } from '@angular/router'

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.css']
})
export class CountriesListComponent implements OnInit {

  countries: [CountriesList];
  constructor(private apiSvc: ApiService, private newsDB: NewsDatabase, private router: Router) { }

  ngOnInit(): void {    
    // Check if DB is empty or not
    this.newsDB.checkCountriesDBCollection()
      .then(res => {
        if (res <= 0) {
          // Get countries from API and populate in DB if and only if the DB is empty
          console.log('>>> Fetching countries list from API')
          this.apiSvc.getCountries()
            .then(res => {
              this.countries = res.map(data => ({ id: data.alpha2Code, name: data.name, countryCode: data.alpha2Code, countryFlagUrl: data.flag }))
              console.info('>>> Adding countries code to DB: ', this.countries);
              console.info(this.countries)
              this.newsDB.saveCountries(this.countries)
                .then(res => console.info(`Countries added to DB`))
                .catch(err => console.error('Error: ', err))
            })
            .catch((err) => console.info('Error: ', err))
        }
        // if DB is not empty, retrive from DB instead
        else {
          console.log('retrieving from DB');
          this.newsDB.getCountries()
            .then(res => this.countries = res)
            .catch(err => console.error('Error: ', err))
        }
      })
      .catch(err => console.error('Error: ', err))
  }
}