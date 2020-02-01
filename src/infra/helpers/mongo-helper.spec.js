const MongoHelper = require('./mongo-helper')

describe('Mongo helper', () => {
  test('should connect when call getDb() and there is no connection', async () => {
    const sut = MongoHelper
    await sut.connect(process.env.MONGO_URL)
    expect(sut.db).toBeTruthy()
    await sut.closeConnection()
    expect(sut.db).toBeFalsy()
    const db = await sut.getDb()
    expect(db).toBeTruthy()
  })
})
