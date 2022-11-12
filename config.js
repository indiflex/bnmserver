// require('dotenv').config();
// module.exports = {
//   PORT
// }

import { config } from 'dotenv';
config();

export const {
  PORT,
  GOOGLE_APP_USER,
  GOOGLE_APP_PASS,
  EKEY: DefaultSalt,
  SECRET,
  COOKIE_SECRET,
  REDIS_INFO,
  ALLOW_HOSTS,
  DB_HOST,
  DB_PASS,
} = process.env;

export const AllowHosts = ALLOW_HOSTS.split(',');

export const DbInfo = {
  host: DB_HOST,
  port: 3306,
  user: 'sico',
  password: DB_PASS,
  database: 'sbdb',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
};

export const RedisInfo = {
  legacyMode: true,
  url: REDIS_INFO,
};

export const MailInfo = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: '587',
  secure: false,
  tls: { rejectUnauthorize: false },
  maxConnections: 5,
  maxMessages: 10,
  auth: { user: GOOGLE_APP_USER, pass: GOOGLE_APP_PASS },
};

export const RegistEmail = (
  userName,
  token,
  host = 'https://bnm.com'
) => `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>B & M</title>
</head>

<body>
  <h3>${userName}님 반값습니다!</h3>
  <div>
    가입을 완료하시려면 아래 가입 승인 버튼을 눌러주세요~
  </div>
  <p><a href="${host}/auth?token=${token}">승인하기</a></p>
</body>

</html>`;
