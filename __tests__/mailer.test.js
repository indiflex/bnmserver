// import { jest } from '@jest/globals';
// import request from 'supertest';
import { getRegistEmailContent } from '../config';
import { Mailer } from '../utils/mailer';
import { Redis } from '../utils/Redis';

/**
 * send mail: emailTitle, emailBody(userName, button with token and userId)
 * confirm token: check token by user
 */

// jest.setTimeout(10000);

const onlyMe = '"시코" <indiflex1@gmail.com>';
// const allUser = 'indiflex1@gmail.com, ho2yahh@gmail.com, 213069@naver.com';

describe('mailsender', () => {
  let mailer;
  let redis;

  beforeAll((done) => {
    mailer = new Mailer();
    redis = new Redis(done);
  });

  afterAll((done) => {
    // redis.end().then(done);
    redis.end();
    // mailer.close();
    done();
  });

  test('send simple mail', (done) => {
    // console.log(new URL('ttt.html', import.meta.url).pathname);
    mailer
      .send({
        from: '"bnm" <indiflex.corp@gmail.com>',
        // to: allUser,
        to: onlyMe,
        subject: '타이틀',
        text: '본문내용',
        html: getRegistEmailContent(
          '홍길동',
          'dfafsdadf23124r3oldefdjsal',
          'http://localhost:4001'
        ),
        attachments: [
          {
            filename: 'ttt.html',
            path: new URL('ttt.html', import.meta.url).pathname,
          },
        ],
      })
      .then((ret) => {
        // console.log('ret>>>', ret);
        expect(ret).toEqual(
          expect.objectContaining({ response: expect.stringMatching(/^250/) })
        );
        // mailer.close();
        console.log('-----------------------------');
        done();
      });
  });

  test.only('regist cofirm token mail', (done) => {
    mailer
      .sendRegist(
        { id: 1, nickname: '홍길동', email: 'indiflex1@gmail.com' },
        redis
      )
      .then((ret) => {
        expect(ret).toEqual(
          expect.objectContaining({ response: expect.stringMatching(/^250/) })
        );
        done();
      });
  });
});
