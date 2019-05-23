let mockGetListImageByTerm
let mockGetListImageByTermFn = jest.fn()
jest.mock('../../main/gateway/client/googleSearchEngineClient', () => ({
  getListImageByTerm: jest.fn().mockImplementation((...params) => {
    mockGetListImageByTermFn(...params)
    return mockGetListImageByTerm
  })
}))

const FetchRandomImage = require('../../main/usecases/FetchRandomImage')

describe('Fetch Random Image', () => {
  let spyConsole
  beforeEach(() => {
    jest.clearAllMocks()
    spyConsole = jest.spyOn(global.console, 'log');
  })

  afterEach(() => {
    new FetchRandomImage().constructor.instance = undefined
  })

  it('should return a singleton instance', () => {
    expect.assertions(6)

    const ref1 = new FetchRandomImage()
    const ref2 = new FetchRandomImage()

    expect(ref1).toBeDefined()
    expect(ref2).toBeDefined()
    expect(ref1).toBe(ref2)

    expect(ref1.imageList).toBeDefined()
    expect(ref1.cacheImageList).toBeDefined()
    expect(ref1.maxStartIndex).toEqual(50)
  })

  it('should search and return a image url from imageList and set to cache list', async () => {
    expect.assertions(10)
    mockGetListImageByTerm = ['http://www.test.com/image.png']

    const fetchRandomImage = new FetchRandomImage()

    expect(fetchRandomImage.cacheImageList['term']).toBeFalsy()

    const imageUrl = await fetchRandomImage.execute('term')

    expect(mockGetListImageByTermFn).toBeCalledWith('term', expect.any(Number))
    expect(imageUrl).toEqual('http://www.test.com/image.png')
    expect(fetchRandomImage.imageList['term']).toEqual([])
    expect(fetchRandomImage.cacheImageList['term']).toEqual(['http://www.test.com/image.png'])

    expect(spyConsole).toHaveBeenCalledWith(expect.stringMatching(/filling the list/))
    expect(spyConsole).toHaveBeenCalledWith(expect.stringMatching(/Search by term: term and start index:/))
    expect(spyConsole).toHaveBeenCalledWith(expect.stringMatching(/list of images length:/), expect.any(Number))
    expect(spyConsole).toHaveBeenCalledWith(expect.stringMatching(/get from image list:/))
    expect(spyConsole).toHaveBeenCalledWith(expect.stringMatching(/list of images length after pop:/), expect.any(Number))
  })

  it('should search and return a image url from imageList if image list are empty', async () => {
    expect.assertions(4)
    mockGetListImageByTerm = ['http://www.test.com/image.png']

    const fetchRandomImage = new FetchRandomImage()
    fetchRandomImage.imageList['term'] = []
    const imageUrl = await fetchRandomImage.execute('term')

    expect(mockGetListImageByTermFn).toBeCalledWith('term', expect.any(Number))
    expect(imageUrl).toEqual('http://www.test.com/image.png')
    expect(fetchRandomImage.imageList['term']).toEqual([])
    expect(fetchRandomImage.cacheImageList['term']).toEqual(['http://www.test.com/image.png'])
  })

  it('should return a image url from image list and not search on client while image list contains items', async () => {
    expect.assertions(11)
    mockGetListImageByTerm = [
      'http://www.test.com/image1.png',
      'http://www.test.com/image2.png',
      'http://www.test.com/image3.png'
    ]

    const fetchRandomImage = new FetchRandomImage()
    let imageUrl = await fetchRandomImage.execute('term')

    expect(imageUrl).toEqual('http://www.test.com/image3.png')
    expect(fetchRandomImage.imageList['term']).toEqual(['http://www.test.com/image1.png', 'http://www.test.com/image2.png'])
    expect(fetchRandomImage.cacheImageList['term']).toEqual([
      'http://www.test.com/image1.png',
      'http://www.test.com/image2.png',
      'http://www.test.com/image3.png'
    ])

    imageUrl = await fetchRandomImage.execute('term')

    expect(imageUrl).toEqual('http://www.test.com/image2.png')
    expect(fetchRandomImage.imageList['term']).toEqual(['http://www.test.com/image1.png'])
    expect(fetchRandomImage.cacheImageList['term']).toEqual([
      'http://www.test.com/image1.png',
      'http://www.test.com/image2.png',
      'http://www.test.com/image3.png'
    ])

    imageUrl = await fetchRandomImage.execute('term')

    expect(imageUrl).toEqual('http://www.test.com/image1.png')
    expect(fetchRandomImage.imageList['term']).toEqual([])
    expect(fetchRandomImage.cacheImageList['term']).toEqual([
      'http://www.test.com/image1.png',
      'http://www.test.com/image2.png',
      'http://www.test.com/image3.png'
    ])
    expect(mockGetListImageByTermFn).toBeCalledWith('term', expect.any(Number))
    expect(mockGetListImageByTermFn).toBeCalledTimes(1)
  })

  it('should not set repeated image to cache image list', async () => {
    expect.assertions(1)
    mockGetListImageByTerm = [
      'http://www.test.com/image1.png',
      'http://www.test.com/image1.png'
    ]

    const fetchRandomImage = new FetchRandomImage()
    await fetchRandomImage.execute('term')

    expect(fetchRandomImage.cacheImageList['term']).toEqual(['http://www.test.com/image1.png'])
  })

  it('should set in cache and image list by term searched', async () => {
    expect.assertions(4)
    mockGetListImageByTerm = [
      'http://www.test.com/image1term1.png',
      'http://www.test.com/image2term1.png'
    ]

    const fetchRandomImage = new FetchRandomImage()
    await fetchRandomImage.execute('term1')

    mockGetListImageByTerm = [
      'http://www.test.com/image1term2.png',
      'http://www.test.com/image2term2.png'
    ]
    await fetchRandomImage.execute('term2')

    expect(fetchRandomImage.imageList['term1']).toEqual(['http://www.test.com/image1term1.png'])
    expect(fetchRandomImage.cacheImageList['term1']).toEqual([
      'http://www.test.com/image1term1.png',
      'http://www.test.com/image2term1.png'])
    expect(fetchRandomImage.imageList['term2']).toEqual(['http://www.test.com/image1term2.png'])
    expect(fetchRandomImage.cacheImageList['term2']).toEqual([
      'http://www.test.com/image1term2.png',
      'http://www.test.com/image2term2.png'])
  })

  it('should get from cache a random image when client not return a image', async () => {
    expect.assertions(3)
    mockGetListImageByTerm = []

    const fetchRandomImage = new FetchRandomImage()
    const spy = jest.spyOn(fetchRandomImage, 'getARandomNumber')
    spy.mockReturnValue(3)
    fetchRandomImage.cacheImageList['term'] = ['img1', 'img2', 'img3']

    const imgFound = await fetchRandomImage.execute('term')

    expect(imgFound).toEqual('img3')
    expect(fetchRandomImage.cacheImageList['term'].includes(imgFound)).toBeTruthy()

    expect(spyConsole).toHaveBeenCalledWith(expect.stringMatching(/get in cache image list:/))
  })

  it('should return a error image when client not return a image and cache image list is empty', async () => {
    expect.assertions(4)
    mockGetListImageByTerm = []

    const fetchRandomImage = new FetchRandomImage()
    const imgFound = await fetchRandomImage.execute('term')

    expect(imgFound).toEqual('https://i.imgur.com/2cDvndy.jpg')
    expect(fetchRandomImage.cacheImageList['term']).toEqual([])
    expect(fetchRandomImage.imageList['term']).toEqual([])
    expect(spyConsole).toHaveBeenCalledWith(expect.stringMatching(/there are no items in the list of images and in the cache list as well/))
  })

  it('should return a random number', async () => {
    expect.assertions(2)
    global.Math.random = jest.fn().mockReturnValue(Number(2))
    global.Math.floor = jest.fn(param => Number(param))

    const fetchRandomImage = new FetchRandomImage()
    const randomNumberReturned = await fetchRandomImage.getARandomNumber(10)

    expect(randomNumberReturned).toEqual(21)
    expect(global.Math.floor).toBeCalledWith(10)
  })
})