export interface ApiKey {
    id: string;
    apiKeyValue: string;
}

// newly added 2811
export interface CountriesList {
    id: string;
    name: string;
    countryCode: string;
    countryFlagUrl: string;
}

export interface Articles {
    id?: number;
    articleIndex: string,
    sourceName: string,
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string,
    isSaved?: boolean,
    cachedTime?: number,
}

// newly added 2811
// Top HeadLines API
export const countriesCode = [ 
    'ae',
    'ar',
    'at',
    'au',
    'be',
    'bg',
    'br',
    'ca',
    'ch',
    'cn',
    'co',
    'cu',
    'cz',
    'de',
    'eg',
    'fr',
    'gb',
    'gr',
    'hk',
    'hu',
    'id',
    'ie',
    'il',
    'in',
    'it',
    'jp',
    'kr',
    'lt',
    'lv',
    'ma',
    'mx',
    'my',
    'ng',
    'nl',
    'no',
    'nz',
    'ph',
    'pl',
    'pt',
    'ro',
    'rs',
    'ru',
    'sa',
    'se',
    'sg',
    'si',
    'sk',
    'th',
    'tr',
    'tw',
    'ua',
    'us',
    've',
    'za',
]
export const topHeadLinesAPIBaseUrl = 'https://restcountries.eu/rest/v2/alpha';

// News API
export const NewsAPIBaseUrl = 'https://newsapi.org/v2/top-headlines'

