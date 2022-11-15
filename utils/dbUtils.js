import { Db } from './Db.js';

/**
 * get the 1 row from schema
 * @param {string} model schema name
 * @param {number} id pk
 * @param {string} col (default is 'id')
 * @param {string} sql (default is 'select * from <schema> where id={id}')
 * @returns 1 row object
 */
export const find = (model, id, col = 'id', sql) => {
  const db = new Db();
  const rows = db.query(sql || `select * from ${model} where ${col}={id}`, {
    id,
  });
  return rows.length ? rows[0] : null;
};
