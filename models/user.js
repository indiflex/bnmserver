import { decryptUserToken } from '../utils/encryptUtils.js';
import { Mailer } from '../utils/mailer.js';

export const user = {
  all: 'select * from User',

  ttt: {
    prev: async ({ params }) => {
      params.limit = 1;
    },
    sqls: [{ main: 'select * from User limit {limit}' }],
  },

  GET: {
    sqls: [
      { main: 'select * from User where id = {id}' },
      {
        side_upfile: 'select * from Upfile where id = {main.profileimg}',
      },
    ],
  },

  POST: {
    sql: 'insert into User(nickname, email, passwd) values({nickname}, {email}, {@pwd_passwd}',
    next: (params, redis) => {
      const mailer = new Mailer();
      const { insertId: id, nickname, email } = params;
      mailer.sendRegist({ id, nickname, email }, redis);
    },
  },

  PUT: 'update User set nickname={nickname}, email={email}, passwd={@pwd_passwd} where id={id}',

  DELETE: `update User set outdt=DATE_FORMAT(current_date(), '%Y-%m-%d') where id={id}`,

  login: 'select * from User where email={email} and passwd={@pwd_passwd}',

  search: `select * from User where nickname like concat('%', {searchStr}, '%')`,

  'confirm-reg': {
    prev: async ({ params, redis }) => {
      // console.log('🚀 ~ params.token', params.token, decrypt(params.token));
      const token = decryptUserToken(params.token);
      // console.log('🚀 ~ token', token);
      // const id = await redis.get(params.token);
      const id = await redis.get(params.token, 'UserRegToken');
      console.log('🚀 ~ id', id, token[0]);
      if (token[0] == id) params.id = id;
    },
    sqls: [{ update: 'update User set state=1 where id={id}' }],
    next: { cmd: 'GET', redirect: '/hello' },
  },
};
