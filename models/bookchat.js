export const bookchat = {
  all: 'select * from BookChat',
  POST: {
    sqls: [
      {
        insert: `insert into BookChat(book, speaker, msg) values(1, {speaker}, {msg})`,
      },
      { main: 'select * from BookChat where id={insertId}' },
    ],
  },
};
