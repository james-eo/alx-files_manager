import { createClient } from 'redis';

class RedisClient {
	constructor () {
		this.client = createClient().on('error', (error) => console.log(error));
	}

	isAlive () {
		if (this.client) {
			return true;
		} else {
			return false;
		}
	}

	async get (key) {
		const val = await this.client.get(key);
		if (!val) {
			return null;
		}
		return val;
	}

	async set (key, val, duration) {
		await this.client.set(key, val, 'EX', duration);
	}

	async del (key) {
		return await this.client.del(key);
	}
}

const redisClient = new RedisClient();

module.exports = redisClient;
