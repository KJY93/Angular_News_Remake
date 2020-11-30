import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoadingComponent } from './components/loading.component';

import { NewsDatabase } from './news.database';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './components/settings.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CountriesListComponent } from './components/countries-list.component';
import { ApiService } from './api.service';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { ArticlesComponent } from './components/articles.component';

const ROUTES: Routes = [
  { path: '', component: LoadingComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'countries-list', component: CountriesListComponent },
  { path: 'articles/:cc/:cname', component: ArticlesComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    SettingsComponent,
    CountriesListComponent,
    ArticlesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    ButtonModule,
    InputTextModule,
    HttpClientModule,
    VirtualScrollerModule,
  ],
  providers: [ 
    NewsDatabase,
    ApiService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
