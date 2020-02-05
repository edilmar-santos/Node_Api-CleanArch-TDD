const { MongoClient } = require('mongodb')

module.exports = {
  async connect (uri) {
    this.uri = uri
    this.connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = await this.connection.db()
  },

  async closeConnection () {
    await this.connection.close()
    this.connection = null
    this.db = null
  },

  async getDb () {
    if (!this.connection || !this.connection.isConnected()) {
      await this.connect(this.uri)
    }
    return this.db
  }
}
