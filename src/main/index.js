const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')

// MongoHelper.connect(env.mongoUrl)
//   .then(() => {
//     const app = require('./config/app')
//     app.listen(5858, () => console.log('ouvindo na porta 5858...'))
//   })
//   .catch(console.error)

const app = require('./config/app')
app.listen(5858, () => console.log('ouvindo na porta 5858...'))
