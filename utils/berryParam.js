import { extendJson, getValue } from './utils';

// select * from User where name =: name;
// params['user'] = { id: 1 };
// select * from Dept where captain = params.user.id;
// const REG = /(?!@rownum)(:|@)([A-Za-z]+)([0-9.a-zA-Z_\\-]*)/g;
// const REG_PARAM = /(:|@)([A-Za-z]+)([0-9.a-zA-Z_\\-]*)/g;
const REG_PARAM = /({)([@A-Za-z]+)([0-9.a-zA-Z_\\-]*)(})/g;
const REG_REPLACER = /^{|}$/g;

// TODO apply utils
const encrypt = (str) => str;

/**
 * berryParam(sql, req, otherParam)
 * sql: 'select * from Table
 *  where id=:userId and name=:loginUser.name
 *    and addr in (@addrs)
 * 
 * param prefix rule
 *  - {k}
 *  - {@arr_k} : value.split('.')
 *  - {@enc_k} : encrypt(value)
 * 
 * usage:
 *  const { query, queryParams } = berryParam(sql, req);
 *  const { query, queryParams } = berryParam(sql, {id: 1});
    conn.execute(query, queryParams, (err, rows) => { })
 *
 * return {query, queryParams, error, params}
 */

export const berryParam = (sql, params) => {
  try {
    // console.log(params);
    const paramKeys = sql.match(REG_PARAM);
    // console.log('***************', paramKeys);
    const query = sql.replace(REG_PARAM, '?');
    const queryParams = paramKeys.map((pk) => {
      const k = pk.replace(REG_REPLACER, ''); // {} 제거
      if (k.startsWith('@')) {
        const val = getValue(params, k.substring(5));
        switch (k.substring(0, 5)) {
          case '@arr_':
            return val.split(',');
          case '@enc_':
            return encrypt(val);
        }
      } else {
        return getValue(params, k);
      }
    });
    return { query, queryParams };
  } catch (error) {
    return { error };
  }
};
