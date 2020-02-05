const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeLoadUserByEmailRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'any_hashPassword'
  }

  return loadUserByEmailRepositorySpy
}

const makeEncrypterSpy = () => {
  class EncrypterSpy {
    async compare (password, hashPassword) {
      this.password = password
      this.hashPassword = hashPassword

      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeTokenGeneratorSpy = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId

      return this.accessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = {}

  return tokenGeneratorSpy
}

const makeUpdateAccessTokenRepositorySpy = () => {
  class UpdateAccessTokenRepositorySpy {
    async update (userId, token) {
      this.userId = userId
      this.token = token
    }
  }
  return new UpdateAccessTokenRepositorySpy()
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const encrypterSpy = makeEncrypterSpy()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepositorySpy()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('Auth Usecase', () => {
  test('should throw MissingParamError when email not provided', async () => {
    const { sut } = makeSut()

    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should throw MissingParamError when password not provided', async () => {
    const { sut } = makeSut()

    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call load method from loadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()

    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('should return null when LoadUserByEmailRepository does not find any user', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null

    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  test('Should return null when call encrypts compare method with invalid password', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false

    const isValid = await sut.auth('any_email@mail.com', 'invalid_password')
    expect(isValid).toBeNull()
  })

  test('Should call encrypts compare method with correct params', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('Should return a valid token when call tokenGenerators generate method providing an userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()

    const accessToken = await sut.auth('any_email@mail.com', 'any_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    expect(accessToken).toBeTruthy()
  })

  test('should call updateAccessTokenRepository with correct params', async () => {
    const { sut, loadUserByEmailRepositorySpy, updateAccessTokenRepositorySpy, tokenGeneratorSpy } = makeSut()

    await sut.auth('any_email@mail.com', 'any_password')
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    expect(updateAccessTokenRepositorySpy.token).toBe(tokenGeneratorSpy.accessToken)
  })

  test('should throws when any dependency not provided or invalid', async () => {
    const invalid = {}
    const suts = [
      new AuthUseCase({
        loadUserByEmailRepository: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        encrypter: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        encrypter: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        encrypter: makeEncrypterSpy(),
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        encrypter: makeEncrypterSpy(),
        tokenGenerator: invalid
      })
    ]

    for (const sut of suts) {
      const promise = sut.auth('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
})
