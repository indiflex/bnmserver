import { jest } from '@jest/globals';
import request from 'supertest';
import { RegistEmail } from '../config';
import { send } from '../utils/mailer';

/**
 * send mail: emailTitle, emailBody(userName, button with token and userId)
 * confirm token: check token by user
 */

describe('mailsender', () => {
  test('send mail', () => {
    // console.log(new URL('ttt.html', import.meta.url).pathname);
    send({
      from: '"bnm" <indiflex.corp@gmail.com>',
      to: 'indiflex1@gmail.com, ho2yahh@gmail.com, 213069@naver.com',
      subject: '타이틀',
      text: '본문내용',
      html: RegistEmail(
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
    });
  });
  // test('cofirm token', () => {});
});
