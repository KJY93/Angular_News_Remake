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
  savedArticles: string[];

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

                // Get saved articles
                this.newsDB.getSavedArticles(this.cc)
                  .then(res => {
                    this.savedArticles = res.map((data) => data.publishedAt)
                    console.info('saved articles pk:', this.savedArticles)
                  })
                  .catch(err => console.error('Error: ', err))
                //

                // Go ahead and retrieve new articles from API and update DB
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

                    console.info('before saved:', this.articlesList)

                    // Filter article lists
                    if (this.savedArticles.length > 0) {
                      let count = 0;
                      let newArticles = [];
                      
                      for (let i = 0; i < this.articlesList.length; i++) {
                        for (let j = 0; j < this.savedArticles.length; j++) {
                          console.info('published at artlist', this.articlesList[i]['publishedAt'])
                          console.info('published at saved',this.savedArticles[j])
                          console.info(this.articlesList[i]['publishedAt'] === this.savedArticles[j])
                          if (this.articlesList[i]['publishedAt'] === this.savedArticles[j]) {
                            count += 1;
                          }
                        }
                        if (count === 0) {
                          console.info('added stuff', this.articlesList[i])
                          newArticles.push(this.articlesList[i]); 
                        }
                        // Reinitialize count 
                        count = 0;
                      }
                      this.articlesList = newArticles;
                    }
                    //

                    console.info(`>>> Cached time exceeded, saving new ${this.cc} articles to DB: `, this.articlesList);

                    this.newsDB.saveArticles(this.articlesList);
                    console.log(`>>> DB saved articles merged with newly fetched ${this.cc} articles`);

                    // Update articlesList with id
                    console.info('>>> Updating article list with id');
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

  async onSaveArticle(id: string, isSaved: boolean) {
      await this.newsDB.markArticleAsSaved(+id, isSaved);
  }
}