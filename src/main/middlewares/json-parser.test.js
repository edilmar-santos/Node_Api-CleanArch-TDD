const request = require('supertest')
const app = require('../config/app')

describe('Json Parser', () => {
  test('Should parse body to JSON', async () => {
    app.post('/parse_body_json', (req, res) => res.send(req.body))

    await request(app)
      .post('/parse_body_json')
      .send({ name: 'test' })
      .expect({ name: 'test' })
  })
})
