const request = require('supertest')
let app

describe('Content Type', () => {
  beforeEach(() => {
    jest.resetModules()
    app = require('../config/app')
  })

  test('Should return json as content-type by default', async () => {
    await app.get('/test_content_type', (req, res) => res.send(''))

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return any specified type, in this case xml', async () => {
    await app.get('/test_content_type', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /xml/)
  })
})
