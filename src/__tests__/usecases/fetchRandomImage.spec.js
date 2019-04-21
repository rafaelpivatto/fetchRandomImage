const fetchRandomImage = require('../../main/usecases/fetchRandomImage')

describe('Fetch Random Image', () => {
  it('should return a image url', () => {
    const imageUrl = fetchRandomImage.fetchImage()
    expect(imageUrl.startsWith('http')).toBeTruthy()
  })
})