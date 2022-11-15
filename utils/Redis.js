import { createClient } from 'redis';
import { RedisInfo } from '../config.js';

const cbFn = (resolve, reject) => (err, data) => {
  if (err) reject(err);
  resolve(data);
};

export class Redis {
  // static #_instance;
  #client;
  constructor(cb) {
    // if (Redis.#_instance) return Redis.#_instance;
    this.#client = createClient(RedisInfo);
    this.#client.connect().then(() => {
      console.log('🚀 ~ redis connect OK');
      if (cb) cb();
    });
    this.#client.on('connect', () =>
      console.log('🚀 ~ Redis Connected', new Date())
    );
    this.#client.on('reconnecting', () =>
      console.log('🚀 ~ Redis Reconnecting', new Date())
    );
    this.#client.on('end', () => console.log('🚀 ~ Redis End', new Date()));
    this.#client.on('error', (error) => console.log('🚀 ~ Redis Error', error));
    // Redis.#_instance = this;
  }

  // static getInstance() {
  //   return Redis.#_instance || new this();
  // }

  connect() {
    return this.#client.connect();
  }

  // get(k) {
  //   return new Promise((resolve, reject) => {
  //     const cb = cbFn(resolve, reject);
  //     this.#client.get(k, cb);
  //   });
  // }
  get(k, grp) {
    return new Promise((resolve, reject) => {
      const cb = cbFn(resolve, reject);
      if (grp) this.#client.hGet(grp, k, cb);
      else this.#client.get(k, cb);
    });
  }

  hget(k, grp) {
    return new Promise((resolve, reject) => {
      const cb = cbFn(resolve, reject);
      this.#client.hGetAll(grp, cb);
    });
  }

  set(k, v, grp) {
    return new Promise((resolve, reject) => {
      const cb = cbFn(resolve, reject);
      if (grp) this.#client.hSet(grp, k, v, cb);
      else this.#client.set(k, v, cb);
    });
  }

  hset(key, field, value) {
    return new Promise((resolve, reject) => {
      const cb = cbFn(resolve, reject);
      this.#client.hSet(key, field, value, cb);
    });
  }

  getClient() {
    return this.#client;
  }

  end() {
    return this.#client.disconnect();
    // return this.#client.quit();
  }
}
