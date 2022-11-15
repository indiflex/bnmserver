import { createTransport } from 'nodemailer';
import { getRegistEmailContent, MailInfo, MAIL_FROM } from '../config.js';
import { encryptUserToken } from './encryptUtils.js';

export class Mailer {
  #mailer;
  constructor() {
    this.#mailer = createTransport(MailInfo);
  }

  send({ from = MAIL_FROM, to, subject, text, html, attachments }) {
    return this.#mailer.sendMail({
      from,
      to,
      subject,
      text,
      html,
      attachments,
    });
  }

  sendRegist(user, redis) {
    const token = encryptUserToken(user);
    // redis.set(token, user.id, 'UserRegToken');
    // redis.set(token, { id: user.id }, 'UserRegToken');
    redis.set(token, user.id);

    return this.send({
      to: user.email,
      subject: `${user.nickname}님 가입인증을 해주세요`,
      html: getRegistEmailContent(user.nickname, token),
    });
  }

  close() {
    this.#mailer.close();
  }
}

// export const sendRegist = async (user, redis) => {
//   const token = encryptUserToken(user);
//   redis.set(user.id, token, 'UserRegToken');

//   return await send({
//     to: user.email,
//     subject: `${user.nickname}님 가입인증을 해주세요`,
//     html: getRegistEmailContent(user.nickname, token),
//   });
// };

// export const send = async ({
//   from = MAIL_FROM,
//   to,
//   subject,
//   text,
//   html,
//   attachments,
//   auth,
// }) => {
//   const trans = createTransport(auth ? { ...MailInfo, auth } : MailInfo);
//   // console.log('**********>>', attachments);
//   let result;
//   try {
//     result = await trans.sendMail({
//       from,
//       to,
//       subject,
//       text,
//       html,
//       attachments,
//     });
//   } catch (error) {
//     result = { response: `500 - ${error.message}` };
//   } finally {
//     console.log('🚀 ~ close', result);
//     trans.close();
//   }

//   return result;
// };
