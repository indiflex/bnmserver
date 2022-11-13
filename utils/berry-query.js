// const sql = {
//   User: {
//     all: 'select * from User',
//     R: 'select * from User where id = {id}',
//     C: {
//       sql: 'insert into User(nickname, email, passwd) values({nickname}, {email}, {@pwd_passwd}',
//       next: () => {},
//     },
//     U: 'update User set nickname={nickname}, email={email}, passwd={@pwd_passwd} where id={id}',
//     D: 'delete from User where id={id}',
//     searchUser: `select * from User where name like concat('%', {searchStr}, '%')`,
//   },
// };
// ==> user: {nickname: 'sdfdsf}
// ..../users/1  GET  C
// ..../users/  GET  all
// ..../users/1  PATCH  U
// ..../users/   POST  C ==> next: R (id: lastInsertId)
// ..../users/1  POST  cmd
