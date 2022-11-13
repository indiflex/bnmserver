import Client from 'socket.io-client';
import { server, io } from '../bnm.js';

const stime = new Date().getTime();
const time = () => new Date().getTime() - stime;

describe('bnm socket test', () => {
  let clientSocket;

  beforeAll((done) => {
    server.on('listening', () => {
      console.log('🚀 ~ express server listening', time());

      clientSocket = new Client(`http://localhost:4001`);
      clientSocket.on('connect', () => {
        clientSocket.on('message', (data) => {
          expect(data).toBe('Welcome to B&M');
          console.log('🚀 ~ receive welcome message', data);
          done();
        });
      });
    });
  });

  afterAll((done) => {
    clientSocket.close();
    io.close();
    server.close();
    console.log('🚀 ~ close clientSocket', time());
    done();
  });

  test('should message', (done) => {
    // client 수신 listener
    clientSocket.on('hello', (data) => {
      console.log('🚀 ~ arg', data);
      expect(data).toBe('BNM');
      console.log('🚀 ~ receive hello ~ collaback', data);
    });

    clientSocket.emit('hello', 'BNM', (arg) => {
      expect(arg).toBe('world');
      console.log('🚀 ~ sent hello ~ callback is', arg);
      done();
    });
  });

  // test('should work - ', (done) => {
  //   clientSocket.on('', (arg) => {
  //     expect(arg).toBe('');
  //   });

  //   clientSocket.emit('', data, (arg) => {
  //     // expect(arg).toBe('world');
  //     console.log('🚀 ~ send hello ~', arg);
  //     done();
  //   });
  // });
});
