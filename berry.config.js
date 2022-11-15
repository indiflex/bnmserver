import { Mailer } from './utils/mailer';

const user = {
  all: 'select * from User limit 1000',
  GET: { main: 'select * from User where id = {id}' },
  POST: {
    sql: 'insert into User(nickname, email, passwd) values({nickname}, {email}, {@pwd_passwd}',
    next: (params, redis) => {
      const mailer = new Mailer();
      const { lastInsertId: id, nickname, email } = params;
      mailer.sendRegist({ id, nickname, email }, redis);
    },
  },
  PUT: 'update User set nickname={nickname}, email={email}, passwd={@pwd_passwd} where id={id}',
  DELETE: `update User set outdt=DATE_FORMAT(current_date(), '%Y-%m-%d') where id={id}`,
  searchUser: `select * from User where name like concat('%', {searchStr}, '%')`,
  'regist-confirm': {
    pre: () => {},
    sql: 'update User set status=1 where id={id}',
    next: 'read',
  },
};

export const sql = { user };
