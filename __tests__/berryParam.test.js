import { berryParam } from '../utils/berryParam';

// const TestQueries = [
//   'select * from Table where id=:id and name = :user.name',
//   'select *, :xx as XX from Table where id=:userId and name=:loginUser.name and addr in (@addrs) limit :limit1, :limit2',
// ];

const request = {
  params: { appid: 'bnmwww', id: 1 },
  // query: { searchStr: 'srcStr' },
  body: { user: { id: 2, name: 'Hong' } },
};

describe('berryParam', () => {
  test('simple sql', () => {
    const sql = 'select * from Table where id=:id and name = :user.name';
    const results = {
      query: 'select * from Table where id=? and name = ?',
      queryParams: [1, 'Hong'],
    };
    // const { query, queryParams, error, params } = berryParam(sql, request);
    const bp = berryParam(sql, request);
    expect(bp).toEqual(results);
  });
});
