import Client from 'socket.io-client';
// import { server, io } from '../bnm.js';

describe('my awesome project', () => {
  let clientSocket;

  beforeAll((done) => {
    clientSocket = new Client(`http://localhost:4001`);
    clientSocket.on('connect', () => {
      clientSocket.on('message', (arg) => {
        // expect(arg).toBe('BNM');
        console.log('************message>>', arg);
      });
      clientSocket.on('hello', (arg) => {
        // expect(arg).toBe('BNM');
        console.log('************hello>>', arg);
        done();
      });
    });
  });

  afterAll(() => {
    clientSocket.close();
  });

  // test('should work', (done) => {
  //   // client 수신 listener
  //   clientSocket.on('hello', (arg) => {
  //     expect(arg).toBe('BNM');
  //     done();
  //   });
  // });

  test('should message', () => {
    // client 수신 listener
    clientSocket.emit('hello', 'BNM', (arg) => {
      // expect(arg).toBe('world');
      console.log('************hello>>', arg);
    });
  });

  // test('should work (with ack)', (done) => {
  //   clientSocket.on('hello', (arg) => {
  //     // expect(arg).toBe('BNM');
  //     console.log('************hello>>', arg);
  //     done();
  //   });
  // });
});
