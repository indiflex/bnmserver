import { extendJson, getValue } from './utils';

// select * from User where name =: name;
// params['user'] = { id: 1 };
// select * from Dept where captain = params.user.id;
// const REG = /(?!@rownum)(:|@)([A-Za-z]+)([0-9.a-zA-Z_\\-]*)/g;
const REG_PARAM = /(:|@)([A-Za-z]+)([0-9.a-zA-Z_\\-]*)/g;

/**
 * berryParam(sql, req, otherParam)
 * sql: 'select * from Table
 *  where id=:userId and name=:loginUser.name
 *    and addr in (@addrs)
 * 
 * usage:
 *  const { query, queryParams } = berryParam(sql, req);
    conn.execute(query, queryParams, (err, rows) => { })
 *
 * return {query, queryParams, error, params}
 */

export const berryParam = (sql, req, otherParams) => {
  try {
    const params = extendJson(req.body, req.query, req.params, otherParams);
    // console.log(params);
    const paramKeys = sql.match(REG_PARAM);
    // console.log('***************', paramKeys);
    const query = sql.replace(REG_PARAM, '?');
    const queryParams = paramKeys.map((k) => getValue(params, k.substring(1)));
    return { query, queryParams };
  } catch (error) {
    return { error };
  }
};
