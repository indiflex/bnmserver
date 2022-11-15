import { Db } from '../utils/Db.js';
import { makeParams } from '../utils/httpUtils.js';
import * as models from '../models/index.js';

const SingleRegEx = new RegExp(/GET|^find-|^get-/);

const after = async (req, res, redis, db, params) => {
  const next = params.action.next;
  if (next) {
    // console.log('🚀 ~ next', next);
    if (next?.redirect) params.redirect = next.redirect;

    if (typeof next === 'function') {
      await next({ req, res, redis, db, params });
    } else if (next.cmd) {
      params.action = params.model[next.cmd];
      params.isSingleResult = 'GET'.includes(next.cmd);

      return await main(req, res, redis, db, params);
    }
  }

  const { schema } = params;
  const result = { error: params.error };

  for (const [k, v] of Object.entries(params.bqrs)) {
    // console.log('🚀 ~ k', k, v);
    const isArray = Array.isArray(v);
    const val = isArray ? v[0] : v;
    // console.log('🚀 ~ val', val);
    if (!isArray) delete v.passwd;
    else if (val && isArray && 'passwd' in val)
      v.forEach((data) => {
        delete data.passwd;
      });

    if (k === 'main') {
      // result[schema] = params.isSingleResult ? v[0] : v;
      result[schema] = v;
    } else if (k.startsWith('side_')) {
      result[k.substring(5)] = v;
    }
  }

  if (params.redirect) res.redirect(params.redirect);
  else res.json(result);
};

const execute = async (db, sqls, params, idx = 0) => {
  const sqlObj = sqls[idx];
  // console.log('🚀 ~ sqlObj', sqlObj);
  if (sqlObj) {
    const [[k, sql]] = Object.entries(sqlObj);
    const rows = await db.query(sql, params);

    if ('affectedRows' in rows) {
      params['affectedRows'] = rows.affectedRows;
      params['insertId'] = rows.insertId;
    } else {
      params.bqrs[k] = k === 'main' && params.isSingleResult ? rows[0] : rows;
      params[k] = params.bqrs[k];
    }

    return execute(db, sqls, params, idx + 1);
  }
};

const main = async (req, res, redis, db, params) => {
  if (typeof params.action === 'string') {
    params.action = { sqls: [{ main: params.action }] };
  }
  await execute(db, params.action.sqls, params);

  return await after(req, res, redis, db, params);
};

const before = async (req, res, redis, db, params) => {
  params.bqrs = {};
  const prev = params.action.prev;
  if (prev) {
    await prev({ req, res, redis, db, params });
  }
  // console.log('🚀 ~ params', params);

  return await main(req, res, redis, db, params);
};

// .../api/:appid/:version/:schemas/:idcmd?searchStr=abc
export const api = (req, res, redis) => {
  const params = makeParams(req);
  // console.log('params>>', params);
  const { idcmd } = req.params;
  if (isNaN(Number(idcmd))) {
    params.cmd = idcmd;
  } else {
    params.id = Number(idcmd);
    params.cmd = req.method;
    params.isSingleResult = true;
  }

  params.model = models[params.schema];
  params.action = params.model[params.cmd];

  if (!params.isSingleResult)
    params.isSingleResult = SingleRegEx.test(params.cmd);

  const db = new Db();
  db.setConn()
    .then(() => before(req, res, redis, db, params))
    .catch((error) => {
      console.error('Error on API:', error);
      res.status(500).json({ error });
    })
    .finally(() => db.release());
};

export const hello = (req, res) => {
  res.send('Hello World!!');
};
