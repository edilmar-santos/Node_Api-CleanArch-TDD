const request = require('supertest')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const app = require('../config/app')

let userModel
describe('Login Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.closeConnection()
  })

  test('Should return code 200 when provided valid params', async () => {
    await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })

    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      })
      .expect(200)
  })
})
