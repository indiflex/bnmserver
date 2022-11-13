import { createClient } from 'redis';
import { RedisInfo } from '../config.js';

export class Redis {
  #client;
  constructor() {
    this.#client = createClient(RedisInfo);
    this.#client.connect().then(() => {
      this.#client.keys('*', (err, data) => {
        console.log('🚀 ~ redis all keys is', err, data);
      });
    });
    this.#client.on('connect', () =>
      console.log('🚀 ~ Redis Connected', new Date())
    );
    this.#client.on('disconnect', () =>
      console.log('🚀 ~ Redis Disconnected', new Date())
    );
    this.#client.on('error', (error) => console.log('🚀 ~ Redis Error', error));
  }

  get(k) {
    return new Promise((resolve, reject) => {
      this.#client.get(k, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  set(k, v) {
    return new Promise((resolve, reject) => {
      this.#client.set(k, v, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  getClient() {
    return this.#client;
  }
}
