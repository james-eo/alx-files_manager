const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  getStatus(request, response) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      response.status(200);
      response.json({ redis: true, db: true });
    }
  }

  async getStats(request, response) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    response.status(200);
    response.json({ users, files });
  }
}

export default new AppController();
