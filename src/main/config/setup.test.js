const request = require('supertest')
const app = require('../config/app')

describe('Setup App', () => {
  test('Should remove x-powered-by from headers requests ', async () => {
    app.get('/x-powered-by', (req, res) => res.send(''))

    const res = await request(app).get('/x-powered-by')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })
})
