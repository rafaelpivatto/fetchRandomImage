const FetchRandomImage = require('../../usecases/FetchRandomImage')

const randomImageController_old = {

  registryEndPoint(app) {
    app.get('/randomImage', (req, res) => {
      if (!req.query.term) {
        return res.send('Error: field "term" is necessary, example: (http://....?term=test)')
      }
      new FetchRandomImage().execute(req.query.term)
        .then(imageUrl => {
          res.send(`<img src="${imageUrl}" alt="image" style="height: 100%;"/>`)
        })
        .catch(error => {
          res.send(`${error}, something wrong!`)
        })

    })
  },

}
module.exports = randomImageController_old