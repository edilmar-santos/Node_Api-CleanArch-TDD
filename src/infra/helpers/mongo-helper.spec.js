const sut = require('./mongo-helper')

describe('Mongo helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.closeConnection()
  })

  test('should connect when call getDb() and there is no connection', async () => {
    expect(sut.db).toBeTruthy()
    await sut.closeConnection()
    expect(sut.db).toBeFalsy()
    const db = await sut.getDb()
    expect(db).toBeTruthy()
    await sut.closeConnection()
  })
})