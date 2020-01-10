
const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missing-param-error')

const Encrypter = require('./encrypter')

describe('Encrypter', () => {
  const makeSut = () => {
    return new Encrypter()
  }

  test('should return true when provide valid params', async () => {
    const sut = makeSut()

    const isValid = await sut.compare('valid_value', 'valid_hash')
    expect(isValid).toBe(true)
  })

  test('should return false when provide invalid params', async () => {
    const sut = makeSut()
    bcrypt.isValid = false

    const isValid = await sut.compare('invalid_value', 'invalid_hash')
    expect(isValid).toBe(false)
  })

  test('should call bcrypts method with correct param', async () => {
    const sut = makeSut()

    await sut.compare('any_value', 'any_hash')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('any_hash')
  })

  test('should throws MissinParamError when params not provided', async () => {
    const sut = makeSut()

    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
