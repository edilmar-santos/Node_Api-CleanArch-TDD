const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }
  }
}

const makeSut = () => {
  return new AuthUseCase()
}

describe('Auth Usecase', () => {
  test('should throw MissingParamError when email not provided', async () => {
    const sut = makeSut()

    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should throw MissingParamError when password not provided', async () => {
    const sut = makeSut()

    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
