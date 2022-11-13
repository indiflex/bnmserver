import { jest } from '@jest/globals';
import { server } from '../bnm';
import { hello } from '../routes/api';

test('hello', (done) => {
  const req = {};
  const res = { send: jest.fn() };
  hello(req, res);
  console.log('calls>>', res.send.mock.calls);
  expect(res.send.mock.calls.length).toBe(1);
  const [[data]] = res.send.mock.calls;
  expect(data).toEqual('Hello World!!');
  server.on('listening', () => {
    console.log('🚀 ~ listening', new Date());
    server.close();
    done();
  });
});
