let mockFetchRandomImageConstructor = jest.fn()
let mockFetchRandomImageExecute = jest.fn()
let mockFetchRandomImageExecutePromise
jest.mock('../../../main/usecases/FetchRandomImage', () => class {
  constructor(...params) {
    mockFetchRandomImageConstructor(...params)
  }

  execute(...params) {
    mockFetchRandomImageExecute(...params)
    return mockFetchRandomImageExecutePromise
  }
})
const randomImageController = require('../../../main/gateway/http/RandomImageController')
const req = jest.fn()
const res = {
  send: jest.fn(),
}
const app = {
  get: jest.fn((route, fn) => {
    fn(req, res)
  }),
}
const mockImageUrl = 'http://www.testImage.com/test.png'

describe('Random Image Controller', () => {

  beforeAll(() => {
    jest.clearAllMocks()
    mockFetchRandomImageExecutePromise = Promise.resolve(mockImageUrl)
  })

  it('should registry a express route', async () => {
    expect.assertions(1)

    await randomImageController.registryEndPoint(app)

    expect(app.get).toHaveBeenCalledWith('/randomImage', expect.any(Function))
  })

  it('should call use case to fetch image', async () => {
    expect.assertions(3)

    await randomImageController.registryEndPoint(app)

    expect(mockFetchRandomImageConstructor).toHaveBeenCalled()
    expect(mockFetchRandomImageExecute).toHaveBeenCalled()
    expect(res.send).toHaveBeenCalledWith(`<img src="${mockImageUrl}"/>`)
  })

  it('Should a error message when a error occurs', async (done) => {
    expect.assertions(3)
    mockFetchRandomImageExecutePromise = Promise.reject('error')

    await randomImageController.registryEndPoint(app)

    setTimeout(() => {
      expect(mockFetchRandomImageConstructor).toHaveBeenCalled()
      expect(mockFetchRandomImageExecute).toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith('error, deu ruim!')
      done()
    }, 100)
  })

})