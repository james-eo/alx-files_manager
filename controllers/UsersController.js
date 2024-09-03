const sha1 = require('sha1');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      response.status(400);
      response.json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      response.status(400);
      response.json({ eroor: 'Missing password' });
      return;
    }

    const usersCollection = dbClient.db.collection('users');

    usersCollection.findOne({ email }, (err, doc) => {
      if (doc) {
        response.status(400);
        response.json({ error: 'Already exist' });
      } else {
        usersCollection.insertOne({ email, password: sha1(password) }, (err, r) => {
          response.status(201);
          response.json({ id: r.insertedId, email });
        });
      }
    });
  }

  async getMe(request, response) {
    const requestHeader = request.get('X-Token');
    const key = `auth_${requestHeader}`;

    const userId = await redisClient.get(key);
    const usersCollection = dbClient.db.collection('users');

    usersCollection.findOne({ _id: ObjectId(userId) }, (err, doc) => {
      if (doc) {
        response.status(201);
        response.json({ id: userId, email: doc.email });
      } else {
        response.status(401);
        response.json({ error: 'Unauthorized' });
      }
    });
  }
}

export default new UsersController();
