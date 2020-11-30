import { Component, OnInit } from '@angular/core';
import { Articles } from '../models';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsDatabase } from '../news.database';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  apiKey: string;
  cc: string;
  pageSize = 30;
  articlesList: Articles[];
  cname: string;

  constructor(private newsDB: NewsDatabase, private router: Router, private activatedRoute: ActivatedRoute, private apiSvc: ApiService) { }

  ngOnInit(): void {

    // Retrieve API Key from session (LS)
    this.apiKey = localStorage.getItem('token');

    // Retrieve country code
    this.cc = (this.activatedRoute.snapshot.params['cc']).toLowerCase();

    // Retrieve country name
    this.cname = this.activatedRoute.snapshot.params['cname'];

    this.newsDB.checkArticlesDBCollection(this.cc)
      .then(res => {
        if (res <= 0) {
          this.apiSvc.getArticlesFromNewsAPI(this.cc, this.apiKey, (this.pageSize).toString())
            .then(results => {
              this.articlesList = results['articles'].map((data): Articles => ({
                articleIndex: this.cc,
                sourceName: data.source.name,
                author: data.author,
                title: data.title,
                description: data.description,
                url: data.url,
                urlToImage: (data.urlToImage && (data.urlToImage.substring(0,4).includes('http')))? data.urlToImage: '/assets/images/no-image-available.png',
                publishedAt: data.publishedAt,
                content: data.content,
                cachedTime: (new Date().getTime()) / 1000,
                isSaved: false, // default to unsaved mode, update it when user clicks on save button
              }))
              console.info(`>>> Adding ${this.cc} articles to DB: `, this.articlesList);
              this.newsDB.saveArticles(this.articlesList);
              console.info('>>> Articles saved');

              // Update articlesList with id
              console.info('>>> Updating article list with id')
              this.newsDB.getArticlesBasedOnCountryCode(this.cc)
                .then(res => {
                  this.articlesList = res;
                  console.info('Articles list updated: ', this.articlesList)
                })
                .catch((err) => console.error(err));

            })
            .catch((err) => console.info('Error: ', err))
        }
        else {
          console.info(`${this.cc} articles already exist`);

          let currTimeStamp = (new Date().getTime()) / 1000;

          // Check Caching Time and isSaved flag
          // If cache time >= 5mins and isSaved flag is false, then delete from DB.
          console.info('Checking cached time and isSaved flag: ');
          this.newsDB.checkDBArticlesCachedTime(this.cc, currTimeStamp)
            .then(res => {
              if (res > 0) {
                console.info(`${res} articles with more than 5 mins and isSaved flag set to false are deleted.`);

                // Go ahead and retrieve articles from API and update DB
                this.apiSvc.getArticlesFromNewsAPI(this.cc, this.apiKey, (this.pageSize).toString())
                  .then(results => {
                    this.articlesList = results['articles'].map((data): Articles => ({
                      articleIndex: this.cc,
                      sourceName: data.source.name,
                      author: data.author,
                      title: data.title,
                      description: data.description,
                      url: data.url,
                      urlToImage: (data.urlToImage && (data.urlToImage.substring(0,4).includes('http'))) ? data.urlToImage: 'assets/images/no-image-available.png',
                      publishedAt: data.publishedAt,
                      content: data.content,
                      cachedTime: (new Date().getTime()) / 1000,
                      isSaved: false, 
                    }))
                    console.info(`>>> Cached time exceeded, saving new ${this.cc} articles to DB: `, this.articlesList);

                    this.newsDB.saveArticles(this.articlesList);
                    console.log(`>>> DB saved articles merged with updated with newly fetched ${this.cc} articles`);

                    // Update articlesList with id
                    console.info('>>> Updating article list with id')
                    this.newsDB.getArticlesBasedOnCountryCode(this.cc)
                      .then(res => {
                        this.articlesList = res;
                        console.info('Articles list updated: ', this.articlesList)
                      })
                      .catch((err) => console.error(err));
                  })
                  .catch((err) => console.info('Error: ', err))
              }
              // retrieve news articles from DB directly if cache time is < 5 mins
              else {
                console.info(`>>> Cached time is not exceeded yet, fetching ${this.cc} data from DB directly`);
                this.newsDB.getArticlesBasedOnCountryCode(this.cc)
                .then(res => {
                  this.articlesList = res;
                })
                .catch((err) => console.error(err));
              }
            })
            .catch(err => console.error('Error: ', err));
        }
      })
      .catch(err => console.error(err))
  }

  async onSaveArticle(id: string) {
      console.info(await this.newsDB.markArticleAsSaved(+id));
  }
}