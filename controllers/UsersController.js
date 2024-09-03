const sha1 = require('sha1');
const dbClient = require('../utils/db');

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
}

export default new UsersController();
