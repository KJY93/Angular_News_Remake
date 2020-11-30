import { Dexie } from 'dexie';
import { ApiKey, CountriesList, Articles } from './models';
import { Injectable } from '@angular/core';

@Injectable()
export class NewsDatabase extends Dexie {
    private apiKey: Dexie.Table<ApiKey, string>
    private countriesList: Dexie.Table<CountriesList ,string> // newly added 2811
    private articlesList: Dexie.Table<Articles, number> // newly added 2911

    constructor() {
        // Database name
        super('newsdb');

        this.version(1).stores({
            apiKey: 'id',
            countriesList: 'id', // newly added 2811
            articlesList: '++id, articleIndex', // newly added 2911
        });
        this.apiKey = this.table('apiKey');
        this.countriesList = this.table('countriesList'); // newly added 2811
        this.articlesList = this.table('articlesList'); // newly added 2911
    };

    // API Keys methods
    async getApiKey(loginCreds: string): Promise<any> {
        // where clause returns a collection
        // use first to retrieve the result
        return await this.apiKey.where('id').equals(loginCreds)
                .first(res => { return Promise.resolve(res) })
                .catch((err) => { 
                    console.error(err); 
                    return Promise.reject(err);
                });
    };

    async saveApiKey(apiKeyObj: ApiKey): Promise<any> {
        return await this.apiKey.add(apiKeyObj);
    };

    async deleteApiKey(id: string): Promise<any> {
        return await this.apiKey.where('id').equals(id).delete();
    };
    // End of API Keys methods


    // Countries List methods
    async saveCountries(countriesList: CountriesList[]): Promise<any> {
        return await this.countriesList.bulkPut(countriesList);
    };

    async checkCountriesDBCollection(): Promise<any> {
        return await this.countriesList.count()
    };

    async getCountries(): Promise<any> {
        return await this.countriesList.toCollection().toArray();
    };
    // End of Countries List methods

    // NewsAPI methods
    async checkArticlesDBCollection(artIndex:string): Promise<any> {
        return await this.articlesList.where('articleIndex').equals(artIndex).count();
    };

    async saveArticles(articlesList:Articles[]): Promise<any> {
        return await this.articlesList.bulkPut(articlesList);
    };

    async checkDBArticlesCachedTime(artIndex:string, currTimeStamp: number): Promise<any> {
        return await this.articlesList.where('articleIndex').equals(artIndex).filter(c => (((currTimeStamp - c.cachedTime) >= 300)) && c.isSaved === false).delete();
    };

    async getArticlesBasedOnCountryCode(artIndex: string): Promise<any> {
        return await this.articlesList.where('articleIndex').equals(artIndex).toArray();
    };

    async markArticleAsSaved(id:number): Promise<any> {
        return await this.articlesList.where('id').equals(id).modify({isSaved: true});
    }
    // End of NewsAPI methods
};
