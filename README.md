# AngularNewsRemake

This project focuses on the development of a news search application that allows users to search for news from different countries
based on the [NewsAPI](https://newsapi.org/account).

## Features Implemented
* Users are able to save their API key at the Settings page.
* Users are able to retrieve news from different countries.
* Users are able to mark an article as 'Saved'.
* Users are able to navigate to the official link to read more on the official news.
* News will be fetched from NewsAPI if the articles collection in the DB is empty. Upon fetching, the data will be cached for 5 mins. After 5 mins has elapsed, articles will be deleted except for those with the isSaved flag set to true. A new call to the API endpoint will be initiated again to fetch new articles to populate the DB.

## Technolgies Used
* Angular
* TypeScript
* PrimeNg   

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
