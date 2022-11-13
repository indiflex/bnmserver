// import { jest } from '@jest/globals';
import request from 'supertest';
import { server } from '../bnm.js';

// beforeEach(async () => {
// });

afterEach(() => server.close());

const makeQuery = (query) => {
  const rets = [];
  for (const k in query) {
    rets.push([`${k}=${query[k]}`]);
  }
  return rets.join('&');
};
const makeUrl = ({ appid, version, schemas, idcmd, query }) =>
  `/api/${appid}/${version}/${schemas}/${idcmd}?${makeQuery(query)}`;

describe.skip('makeQyery & makeUrl', () => {
  test('makeQuery', () => {
    const pq = {
      appid: 'www',
      version: '0.0.1',
      schema: 'users',
      idcmd: 'all',
      query: { searchStr: '11' },
    };
    const searchParam = makeQuery(pq.query);
    expect(searchParam).toEqual('searchStr=11');
  });

  test('makeUrl', () => {
    const pq = {
      appid: 'www',
      version: '0.0.1',
      schemas: 'users',
      idcmd: 'all',
      query: { searchStr: '11' },
    };
    const searchParam = makeQuery(pq.query);
    const expectData = `/api/${pq.appid}/${pq.version}/${pq.schemas}/${pq.idcmd}?${searchParam}`;
    const res = makeUrl(pq);
    expect(res).toEqual(expectData);
  });
});

describe.skip('api - home & params', () => {
  test('home', async () => {
    // const response = await request(app).get('/');
    const response = await request(server).get('/');
    expect(response.statusCode).toBe(200);
    // console.log('res>>>', response.body);
  });

  // .../api/:appid/:version/:schemas/:idcmd?searchStr=abc
  test('apiParams', async () => {
    const expectData = {
      appid: 'www',
      version: '0.0.1',
      schemas: 'users',
      idcmd: 'all',
      query: { searchStr: '11' },
    };
    const sampleUrl = makeUrl(expectData);
    console.log('🚀 ~ sampleUrl', sampleUrl);
    const response = await request(server).get(
      sampleUrl.replace('/api/', '/apiparams/')
    );
    expect(response.statusCode).toBe(200);
    // console.log('res>>>', response.body);
    expect(response.body).toEqual(expectData);
  });
});
