import { createClient } from 'redis';

const promisifyAll = require('./helpers');

class RedisClient {
  constructor() {
    this.client = createClient().on('error', (error) => console.log(error));
    this.client = promisifyAll(this.client, ['get', 'set', 'del']);
  }

  isAlive() {
    if (this.client) {
      return true;
    }
    return false;
  }

  async get(key) {
    try {
      const val = await this.client.getAsync(key);
      if (val != null) {
        return val;
      }
      return null;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async set(key, val, duration) {
    await this.client.setAsync(key, val, 'EX', duration);
  }

  async del(key) {
    await this.client.delAsync(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
