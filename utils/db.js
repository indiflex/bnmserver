import { createPool } from 'mysql2/promise';
import { DbInfo } from '../config.js';
import { berryParam } from './berryParam.js';

const QueryRegExp = new RegExp(/(limit|order)[0-9,\s]*\?/);

const makePool = () => {
  console.log('🚀 ~ createPool', new Date());
  return createPool(DbInfo);
};

export class Db {
  static #pool;
  #conn;
  #didRollback = false;
  #withTransaction = false;
  constructor(withTransaction) {
    if (!Db.#pool) Db.#pool = makePool();
    this.#withTransaction = withTransaction;
  }

  async setConn() {
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
    this.#conn = await Db.#pool.getConnection();
    if (this.#withTransaction) this.#conn.beginTransaction();
  }

  async query(sql, params) {
    const { query, queryParams } = berryParam(sql, params);
    if (!this.#conn) await this.setConn();

    console.log('🚀 ~ query', query, queryParams);
    const [rows] = QueryRegExp.test(query)
      ? await this.#conn.query(query, queryParams)
      : await this.#conn.execute(query, queryParams);
    // setTimeout(() => this.release(), 5000);
    return rows;
  }

  rollback() {
    this.#didRollback = true;
    if (this.#conn) this.#conn.rollback();
  }

  release() {
    console.log('===================================');
    if (!this.#didRollback) this.#conn.commit();
    if (this.#conn) this.#conn.release();
  }
}
