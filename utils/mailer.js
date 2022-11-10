import { createTransport } from 'nodemailer';
import { MailInfo } from '../config';

export const send = async ({
  from,
  to,
  subject,
  text,
  html,
  attachments,
  auth,
}) => {
  const trans = createTransport(auth ? { ...MailInfo, auth } : MailInfo);
  // console.log('**********>>', attachments);
  try {
    const result = await trans.sendMail({
      from,
      to,
      subject,
      text,
      html,
      attachments,
    });
    // console.log(result);

    return result;
  } catch (error) {
    throw error;
  } finally {
    trans.close();
  }
};
