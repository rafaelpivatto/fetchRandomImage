const { google } = require('googleapis')
const customSearch = google.customsearch('v1')

const googleSearchEngineClient = {

  getListImageByTerm(term = 'Wrong', startIndex = 1) {
    console.log(`Search in google with term "${term}" and start index in ${startIndex}`)
    return new Promise((resolve) => {
      customSearch.cse.list({
        auth: 'AIzaSyBtH1EDcbP7QQ7OQffvXk5o-zyKqpob3Gw',
        cx: '010482265010629923816:dfyebjtrj6c',
        q: term,
        exactTerms: term,
        imgSize: 'xxlarge',
        start: startIndex,
      })
      .then(response => {
        if (response.status != 200) resolve([])

        const images = response.data.items.filter(item => {
          return item.pagemap.cse_image
        }).map(item => {
          return item.pagemap.cse_image[0].src
        })
        console.log('Images found: ', images)
        resolve(images)
      })
      .catch(error => {
        console.log('Erro: ', error)
        resolve([])
      })
    })
  }

}

module.exports = googleSearchEngineClient