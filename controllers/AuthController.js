import { v4 as uuidv4 } from 'uuid';

const { ObjectId } = require('mongodb');
const sha1 = require('sha1');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AuthController {
  getConnect(request, response) {
    const authHeader = request.headers.authorization;
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString()
      .split(':');

    const usersCollection = dbClient.db.collection('users');

    usersCollection.findOne(
      { email: credentials[0], password: sha1(credentials[1]) },
      async (err, doc) => {
        if (doc) {
          const token = uuidv4();
          const key = `auth_${token}`;
          const duration = 24 * (60 ** 2);

          await redisClient.set(key, doc._id.toString(), duration);
          response.set(200);
          response.json({ token });
        } else {
          response.status(401);
          response.json({ error: 'Unauthorized' });
        }
      },
    );
  }

  async getDisconnect(request, response) {
    const requestHeader = request.get('X-Token');
    const key = `auth_${requestHeader}`;

    const userId = await redisClient.get(key);
    const usersCollection = dbClient.db.collection('users');

    usersCollection.findOne({ _id: ObjectId(userId) }, (err, doc) => {
      if (doc) {
        redisClient.del(key);
        response.status(201);
        response.send();
      } else {
        response.status(401);
        response.json({ error: 'Unauthorized' });
      }
    });
  }
}

export default new AuthController();
