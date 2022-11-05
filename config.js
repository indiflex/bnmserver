// require('dotenv').config();
// module.exports = {
//   PORT
// }

import { config } from 'dotenv';
config();

export const { PORT, GOOGLE_APP_PASS } = process.env;

export const DbInfo = {};

export const MailInfo = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: '587',
  secure: false,
  tls: { rejectUnauthorize: false },
  maxConnections: 5,
  maxMessages: 10,
  auth: { user: 'indiflex.corp@gmail.com', pass: GOOGLE_APP_PASS },
};
