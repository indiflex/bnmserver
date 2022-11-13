// import request from 'supertest';
import { RegistEmail } from '../config';
import { send } from '../utils/mailer';

/**
 * send mail: emailTitle, emailBody(userName, button with token and userId)
 * confirm token: check token by user
 */

const onlyMe = '"시코" <indiflex1@gmail.com>';
// const allUser = 'indiflex1@gmail.com, ho2yahh@gmail.com, 213069@naver.com';

describe('mailsender', () => {
  test('send mail', async () => {
    // console.log(new URL('ttt.html', import.meta.url).pathname);
    const ret = await send({
      from: '"bnm" <indiflex.corp@gmail.com>',
      // to: allUser,
      to: onlyMe,
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
    // console.log('ret>>>', ret);
    expect(ret).toEqual(
      expect.objectContaining({ response: expect.stringMatching(/^250/) })
    );
  });

  // test('cofirm token', () => {});
});
