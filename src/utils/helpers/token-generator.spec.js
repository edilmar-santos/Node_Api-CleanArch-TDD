const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')

const TokenGenerator = require('./token-generator')

describe('Token Generator', () => {
  const makeSut = () => {
    return new TokenGenerator('secret')
  }

  test('should return null when JWT returns null ', async () => {
    const sut = makeSut()
    jwt.token = null

    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('should return token when JWT returns a token', async () => {
    const sut = makeSut()

    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  test('should call JWT with correct params', async () => {
    const sut = makeSut()

    await sut.generate('any_id')
    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(sut.secret)
  })

  test('should throw MissingParamError when id not provided', () => {
    const sut = makeSut()

    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })

  test('should throw MissingParamError when secret not provided', () => {
    const sut = new TokenGenerator()

    const promise = sut.generate('any_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })
})
