let mockListReturn
let mockListCall = jest.fn()
let mockList = jest.fn((...params) => {
  mockListCall(...params)
  return mockListReturn
})
let mockCustomsearchCall = jest.fn()
jest.mock('googleapis', () => ({
  google: {
    customsearch: jest.fn().mockImplementation((...params) => {
      mockCustomsearchCall(...params)
      return {
        cse: {
          list: jest.fn(() => {
            return Promise.resolve('oi')
          })
        }
      }
    })
  },
}))

const googleSearchEngineClient = require('../../../main/gateway/client/googleSearchEngineClient')

describe.skip('Fetch Random Image', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockListReturn = Promise.resolve('test')
  })

  it('should ', async (done) => {
    await googleSearchEngineClient.getListImageByTerm()
    done()
  })
});