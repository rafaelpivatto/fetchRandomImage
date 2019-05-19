const FetchRandomImage = require('../../usecases/FetchRandomImage')

const randomImageController_old = {

  registryEndPoint(app) {
    app.get('/randomImage', (req, res) => {

      new FetchRandomImage().execute('test')
        .then(imageUrl => {
          res.send(`<img src="${imageUrl}"/>`)
        })
        .catch(error => {
          res.send(`${error}, deu ruim!`)
        })

    })
  },

}
module.exports = randomImageController_old