const fetchRandomImage = require('../../usecases/fetchRandomImage')

class RandomImageController {
  constructor(app) {
    this.registryEndPoint(app)
  }

  async registryEndPoint(app) {
    const imageUrl = await fetchRandomImage.fetchImage()
    app.get('/randomImage', (req, res) => res.send(imageUrl))
  }

}
module.exports = RandomImageController