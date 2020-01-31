const { MongoClient } = require('mongodb')

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    return this.userModel.findOne({ email })
  }
}

describe('Load User By Email Repository', () => {
  let connection, db

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await connection.close()
  })

  test('Should return null when user not found', async () => {
    const userModel = db.collection('users')
    const sut = new LoadUserByEmailRepository(userModel)
    const user = await sut.load('invalid_email@mail.com')

    expect(user).toBeNull()
  })

  test('Should return user when find valid email', async () => {
    const userModel = db.collection('users')
    await userModel.insertOne({
      email: 'valid_email@mail.com'
    })

    const sut = new LoadUserByEmailRepository(userModel)
    const user = await sut.load('valid_email@mail.com')

    expect(user.email).toBe('valid_email@mail.com')
  })
})
