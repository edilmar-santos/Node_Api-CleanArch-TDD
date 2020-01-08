const { UnauthorizedError, ServerError } = require('../errors')

module.exports = class HttpResponse {
  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }

  static badRequest (erro) {
    return {
      statusCode: 400,
      body: erro
    }
  }

  static unauthorized () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }
}
