import { berryParam } from '../utils/berryParam';
import { makeParam } from '../utils/httpUtils';

// const TestQueries = [
//   'select * from Table where id=:id and name = :user.name',
//   'select *, :xx as XX from Table where id=:userId and name=:loginUser.name and addr in (@addrs) limit :limit1, :limit2',
// ];

const request = {
  params: { appid: 'bnmwww', id: 1 },
  // query: { searchStr: 'srcStr' },
  body: { user: { id: 2, name: 'Hong', roles: '1,2,3', ssn: '010102' } },
};

describe('berryParam - new version', () => {
  test('simple sql', () => {
    const sql = `select *, 'ab:cd' abcd, {appid} as app from Table where id={id} and name = {user.name} and xx = 'abc:ef' and role in ({@arr_user.roles}) and ssn = {@enc_user.ssn}`;
    //`const { query, queryParams, error, params } = berryParam(sql, request);
    const { query, queryParams } = berryParam(sql, makeParam(request));
    expect(query).toBe(
      `select *, 'ab:cd' abcd, ? as app from Table where id=? and name = ? and xx = 'abc:ef' and role in (?) and ssn = ?`
    );
    expect(queryParams).toEqual([
      'bnmwww',
      1,
      'Hong',
      ['1', '2', '3'],
      'c4e541021f0b76fbc35c9f23d4c80f62:ZTUgVA559q0sPryU17S8mg==',
    ]);
  });
});

describe.skip('berryParam - old', () => {
  test('simple sql', () => {
    const sql = `select *, 'ab:cd' abcd, :appid as app from Table where id=:id and name = :user.name and xx = 'abc:ef'`;
    //`const { query, queryParams, error, params } = berryParam(sql, request);
    const bp = berryParam(sql, request);
    expect(bp).toEqual({
      query: `select *, 'ab:cd' abcd, ? as app from Table where id=? and name = ? and xx = 'abc:ef'`,
      queryParams: ['bnmwww', 1, 'Hong'],
    });
  });
});
