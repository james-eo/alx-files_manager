import { MongoClient } from 'mongodb';

const { env } = process;

class DBClient {
  constructor() {
    const host = env.DB_HOST || 'localhost';
    const port = env.DB_PORT || 27017;
    const database = env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}`;
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        this.db = false;
        return;
      }
      this.db = client.db(database);
    });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    try {
      const users = this.db.collection('users');
      const estimatedUsers = await users.countDocuments();
      return estimatedUsers;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async nbFiles() {
    try {
      const files = this.db.collection('files');
      const estimatedUsers = await files.countDocuments();
      return estimatedUsers;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
