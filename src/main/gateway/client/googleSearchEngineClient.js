const { google } = require('googleapis')
const customSearch = google.customsearch('v1')
const config = require('../../application.config')

const googleSearchEngineClient = {

  async getListImageByTerm(term = 'Wrong', startIndex = 1) {
    console.log(`Search in google with term "${term}" and start index in ${startIndex}`)
    await customSearch.cse.list({
      auth: config.credential.customSearch.cloundPlatformKey,
      cx: config.credential.customSearch.searchEngineId,
      q: term,
      exactTerms: term,
      imgSize: 'xxlarge',
      start: startIndex,
      siteSearch: ''
    })
    .then(response => {
      if (response.status !== 200) resolve([])

      const images = response.data.items.filter(item => {
        return item.pagemap.cse_image
      }).map(item => {
        return item.pagemap.cse_image[0].src
      })
      console.log('Images found: ', images)
      resolve(images)
    })
    .catch(error => {
      console.log('Error: ', error)
      resolve([])
    })
  }

}

module.exports = googleSearchEngineClient