jest.mock('../../../main/usecases/fetchRandomImage', () => ({
  fetchImage: jest.fn(() => 'imgUrl')
}))
const RandomImageController = require('../../../main/gateway/http/RandomImageController')
const req = jest.fn()
const res = {
  send: jest.fn(),
}
const app = {
  get: jest.fn((route, fn) => {
    fn(req, res)
  }),
}

describe('Random Image Controller', () => {
  let controller;

  beforeAll(() => {
    controller = new RandomImageController(app)
  })
  
  it('should registry a express route', () => {
    expect(app.get).toHaveBeenCalledWith('/randomImage', expect.any(Function))
  })

  it('should call use case to fetch image', () => {
    expect(req).not.toHaveBeenCalled()
    expect(res.send).toHaveBeenCalledWith('imgUrl')
  })

})