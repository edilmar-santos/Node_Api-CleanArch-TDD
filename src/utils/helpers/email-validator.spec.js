const EmailValidator = require('./email-validator')
const validator = require('validator')
const MissingParamError = require('../errors/missing-param-error')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('should return true when provided a valid email', () => {
    const sut = makeSut()

    const isValidValid = sut.isValid('valid_email@email.com')
    expect(isValidValid).toBe(true)
  })

  test('should throws MissinParamError when email not provided', () => {
    const sut = makeSut()

    expect(sut.isValid).toThrow(new MissingParamError('email'))
  })

  test('should return false when provided a invalid email', () => {
    const sut = makeSut()
    validator.isValidEmail = false

    const isValidValid = sut.isValid('invalid_email@email.com')
    expect(isValidValid).toBe(false)
  })

  test('should call validator with the correct email', () => {
    const sut = makeSut()
    sut.isValid('any_email@email.com')

    expect(validator.email).toBe('any_email@email.com')
  })
})
