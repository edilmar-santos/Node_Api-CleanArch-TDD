module.exports = class ServerError extends Error {
  constructor () {
    super('An internal server error occurred. Please try again.')
    this.name = 'ServerError'
  }
}
