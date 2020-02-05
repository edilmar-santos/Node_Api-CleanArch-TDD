const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('./../../utils/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

let userModel, fakeUserId

const makeSut = () => {
  return new UpdateAccessTokenRepository(userModel)
}

describe('Update Access Token', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      name: 'test'
    })

    fakeUserId = fakeUser.ops[0]._id
  })

  afterAll(async () => {
    await MongoHelper.closeConnection()
  })

  test('Should update the user with the provided accessToken', async () => {
    const sut = makeSut()
    await sut.update(fakeUserId, 'valid_token')
    const userUpdated = await userModel.findOne({ _id: fakeUserId })
    expect(userUpdated.accessToken).toBe('valid_token')
  })

  test('Should throw an Execption when parameters not provided', async () => {
    const sut = makeSut()

    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
