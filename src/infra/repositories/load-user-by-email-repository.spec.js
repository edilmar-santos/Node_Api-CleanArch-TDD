const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MissingParamError = require('./../../utils/errors/missing-param-error')

let userModel

const makeSut = () => {
  return new LoadUserByEmailRepository()
}

describe('Load User By Email Repository', () => {
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

  test('Should return null when user not found', async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_email@mail.com')

    expect(user).toBeNull()
  })

  test('Should return user when find valid email', async () => {
    const sut = makeSut()

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      name: 'test'
    })

    const user = await sut.load('valid_email@mail.com')
    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })

  test('Should throw an Execption when email not provided', async () => {
    const sut = makeSut()
    const promise = sut.load()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
