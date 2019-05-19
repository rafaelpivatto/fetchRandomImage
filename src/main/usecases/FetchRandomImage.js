const googleSearch = require('../gateway/client/googleSearchEngineClient')

class FetchRandomImage {

  constructor() {
    const instance = this.constructor.instance;
    if (instance) {
      return instance;
    }

    this.maxStartIndex = 89;
    this.imageList = {};
    this.cacheImageList = {};
    this.constructor.instance = this;
  }

  async execute(term) {
    if (!this.cacheImageList[term]) {
      this.cacheImageList[term] = []
    }

    if (!this.imageList[term] || this.imageList[term].length === 0) {
      console.log('filling the list')

      const randomStartIndex = this.getARandomNumber(this.maxStartIndex)
      console.log(`Search by term: ${term} and start index: ${randomStartIndex}`)
      
      this.imageList[term] = await googleSearch.getListImageByTerm(term, randomStartIndex)
      console.log('list of images length: ', this.imageList[term].length)
    
      this.imageList[term].forEach(item => {
        if (!this.cacheImageList[term].includes(item)) {
          this.cacheImageList[term].push(item)
        }
      })
    }

    return this.getOneImage(term)
  }

  getARandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max) + 1)
  }

  getOneImage(term) {
    let imgUrl;
    if (this.imageList[term] && this.imageList[term].length > 0) {
      imgUrl = this.imageList[term].pop()
      console.log('list of images length after pop: ', this.imageList[term].length)
      console.log(`get from image list: ${imgUrl}`)
    } else if (this.cacheImageList[term].length > 0) {
      const cacheSize = this.cacheImageList[term].length
      const randomNumber = this.getARandomNumber(cacheSize)
      imgUrl = this.cacheImageList[term][randomNumber - 1]
      console.log(`get in cache image list: ${imgUrl}`)
    } else {
      console.log('there are no items in the list of images and in the cache list as well')
      imgUrl = 'https://i.imgur.com/2cDvndy.jpg'
    }
    return imgUrl
  }
}

module.exports = FetchRandomImage