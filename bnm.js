import express from 'express';

import ogs from 'open-graph-scraper';
import { createPool } from 'mysql2';
import { Server } from 'socket.io';
import { PORT, DbInfo } from './config.js';
import { hello, api, apiParams } from './routes/api.js';
import {
  makeParams,
  setSessionAndCookie,
  allowHosts,
} from './utils/httpUtils.js';
import { Redis } from './utils/Redis.js';
import { berryParam } from './utils/berryParam.js';

const app = express();
const redis = new Redis();

setSessionAndCookie(app, redis);
app.use(allowHosts);

const sql = {
  User: {
    all: 'select * from User',
    R: 'select * from User where id = {id}',
    C: {
      sql: 'insert into User(nickname, email, passwd) values({nickname}, {email}, {@pwd_passwd}',
      next: () => {},
    },
    U: 'update User set nickname={nickname}, email={email}, passwd={@pwd_passwd} where id={id}',
    D: 'delete from User where id={id}',
    searchUser: `select * from User where name like concat('%', {searchStr}, '%')`,
  },
};
// ==> user: {nickname: 'sdfdsf}
// ..../users/1  GET  C
// ..../users/  GET  all
// ..../users/1  PATCH  U
// ..../users/   POST  C ==> next: R (id: lastInsertId)
// ..../users/1  POST  cmd

const pool = createPool(DbInfo);
app.get('/mysql/:id', (req, res) => {
  const params = makeParams(req);
  pool.getConnection((err, conn) => {
    // conn.beginTransaction();
    const { query, queryParams } = berryParam(
      'select * from User where nickname={nickname} and id >= {id}',
      params
    );

    console.log('🚀 ~ query', query, queryParams);
    conn.execute(query, queryParams, (err, rows) => {
      console.log(err, rows);
      res.json({ rows });
    });

    pool.releaseConnection(conn);
  });
});

app.get('/', hello);

app.all('/ogscrapper', (req, res) => {
  ogs({ url: req.query.url }).then(({ error, result }) => {
    if (error) return res.status(500).json({ message: error.message });
    // console.log('rrr>>', result);
    res.json(result);
  });
});

// app.get('/api/:appid/:version/:schemas', );
app.all('/api/:appid/:version/:schemas/:idcmd', api);

app.all('/apiparams/:appid/:version/:schemas/:idcmd', apiParams);

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// console.log('meta>>', import.meta.url);
const server = app.listen(PORT, () => {
  console.log(`B&M Server listening on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: [],
    credentials: true,
  },
});

// const redisAdapter = require('socket.io-redis');
// io.adapter(redisAdapter(project.redisInfo));

// const socketMap = new Map();
// socketMap.set('<userId>', socket.id);
// socketMap.set('<roomId>', socket.id);

io.sockets.on('connection', (socket) => {
  console.log('socket>>>>>', socket.id);
  // const { token } = socket.handshake.query;
  const square = 'BnmSquare';
  socket.join(square);
  socket.emit('message', 'Welcome to B&M');
  socket.on('hello', (data, cb) => {
    console.log('sssssssssssssssss>>', data);
    socket.to(square).emit('hello', data);
    cb('world');
  });
});

export { server, io };
