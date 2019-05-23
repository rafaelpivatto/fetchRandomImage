# Fetch Random Image

[![Build Status](https://travis-ci.org/rafaelpivatto/fetchRandomImage.svg?branch=master)](https://travis-ci.org/rafaelpivatto/fetchRandomImage)
![Build Status](https://badge.stryker-mutator.io/github.com/rafaelpivatto/fetchRandomImage/master)

It's a simple application to fetch and return a random image based in a term passed by query param.
Example: http://...../?**term=anything**

# To setup

- Create in Google Cloud Platform a API key - https://console.cloud.google.com/apis/credentials
- Set this API key credential in **CLOUD_PLATFORM_KEY**
- Create a Google Custom Search Engine to obtain a search engine ID - https://cse.google.com/cse
- Set this cse environment variable in **SEARCH_ENGINE_ID**
  
# To Run

`npm install` - to install all dependencies

`npm start` - to start application by default on port :3000

`npm run test` - to run jest + stryker mutator tests

`npm run jest` - to run only jest tests

`npm run stryker` - to run only stryker mutator tests

The application will be initialized on: `http://localhost:3000/randomImage?term=anything`