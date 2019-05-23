let mockFetchRandomImageConstructor = jest.fn()
let mockFetchRandomImageExecute = jest.fn()
let mockFetchRandomImageExecutePromise
let mockTerm = 'test'
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
const req = {
  query: {
    term: mockTerm
  }
}
const res = {
  send: jest.fn(),
}
let app
const mockImageUrl = 'http://www.testImage.com/test.png'

describe('Random Image Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetchRandomImageExecutePromise = Promise.resolve(mockImageUrl)
    mockTerm = 'term'
    app = {
      get: jest.fn((route, fn) => {
        fn(req, res)
      }),
    }
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
    expect(res.send).toHaveBeenCalledWith(`<img src="${mockImageUrl}" alt="image" style="height: 100%;"/>`)
  })

  it('Should a error message when a error occurs', async (done) => {
    expect.assertions(3)
    mockFetchRandomImageExecutePromise = Promise.reject('error')

    await randomImageController.registryEndPoint(app)

    setTimeout(() => {
      expect(mockFetchRandomImageConstructor).toHaveBeenCalled()
      expect(mockFetchRandomImageExecute).toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith('error, something wrong!')
      done()
    }, 100)
  })

  it('should validate when query term is not informed', async () => {
    const req = {
      query: {
        term: undefined
      }
    }
    app = {
      get: jest.fn((route, fn) => {
        fn(req, res)
      }),
    }
    expect.assertions(1)

    await randomImageController.registryEndPoint(app)

    expect(res.send).toHaveBeenCalledWith('Error: field "term" is necessary, example: (http://....?term=test)')
  })

})