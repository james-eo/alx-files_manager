import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Specify host and port explicitly
    this.client = createClient({
      socket: {
        host: '127.0.0.1', // Corrected IP address
        port: 6379,        // Default port
      },
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    
    // Connect and catch connection errors
    this.client.connect().catch((err) => console.error('Redis Client Connect Error', err));
  }

  async isAlive() {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      return false;
    }
  }
  isAlive() {
    return this.client.isOpen;
  }

  // Get the value of a key from Redis
  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Error getting value for key ${key}:`, error);
      return null;
    }
  }

  // Set a key-value pair in Redis with expiration
  async set(key, value, duration) {
    try {
      await this.client.set(key, value, { EX: duration });
    } catch (error) {
      console.error(`Error setting value for key ${key}:`, error);
    }
  }

  // Delete a key from Redis
  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Error deleting key ${key}:`, error);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
