import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { queryParams } from './utils/utils';
import { NewsDatabase } from './news.database';
import { topHeadLinesAPIBaseUrl, NewsAPIBaseUrl } from './models';

@Injectable()
export class ApiService {
    constructor (private http: HttpClient, private newsDB: NewsDatabase) {}

    // Top Headlines API
    async getCountries(): Promise<any> {
        let params = queryParams();     
        return await this.http.get(topHeadLinesAPIBaseUrl, { params: params }).toPromise();
    }

    // NewsAPI
    async getArticlesFromNewsAPI(cc: string, apiKey:string, pageSize:string): Promise<any> {
        let params = new HttpParams()
                        .set('country', cc)
                        .set('pageSize', pageSize)

        let headers = (new HttpHeaders()).set('X-Api-Key', apiKey)
        let results = await this.http.get(NewsAPIBaseUrl, { headers: headers, params: params }).toPromise();
        
        return results
                        
    }
}