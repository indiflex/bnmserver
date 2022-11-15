import express from 'express';

import ogs from 'open-graph-scraper';
import { Server as SocketServer } from 'socket.io';
import { PORT, AllowHosts } from './config.js';
import { api } from './routes/api.js';
import {
  makeParams,
  setSessionAndCookie,
  allowHosts,
} from './utils/httpUtils.js';
import { Redis } from './utils/Redis.js';
// import { berryParam } from './utils/berryParam.js';
import { Db } from './utils/Db.js';
import { setupLocalStrategy } from './utils/pass.js';

const app = express();
const redis = new Redis();
// const k01 = await redis.get('key01');
// // console.log('🚀 ~ k01', k01);

setSessionAndCookie(app, redis.getClient());
app.use(allowHosts);

app.get('/close-redis', async (req, res) => {
  const k01 = await redis.get('key01');
  console.log('🚀 ~ k01', k01);
  redis.end();
  res.send('Redis Closed');
  const r = new Redis();
  console.log('k01>>', await r.get('key01'));
});

app.get('/mysql/:id', async (req, res) => {
  const params = makeParams(req);
  const db = new Db(true);
  try {
    const r1 = await db.query('update User set state = state + 1 where id=1');
    console.log('🚀 ~ r1', r1);

    const r2 = await db.query(
      'update User set passwd={@pwd_passwd} where id = {id}',
      params
    );
    console.log('🚀 ~ r2', r2);

    // // console.log('🚀 ~ query', query, queryParams);
    // const [rows] = await conn.execute(query, queryParams);
  } catch (error) {
    db.rollback();
    console.error('error - ', error);
  } finally {
    db.release();
  }

  const db2 = new Db();
  db2
    .query(
      `select u.*, concat(uf.syspath, '/', uf.sysname) ufpath , uf.* from User u left outer join Upfile uf on uf.id = u.profileimg where u.id = {id}`,
      params
    )
    .then((rows) => {
      // console.log('qqq>>', err, rows);
      res.json({ rows });
    });
  // .finally(() => db2.release());
});
// const pool = createPool(DbInfo);
// app.get('/mysql/:id', async (req, res) => {
//   const params = makeParams(req);
//   const conn = await pool.getConnection();
//   conn.beginTransaction();
//   const { query, queryParams } = berryParam(
//     `select u.*, concat(uf.syspath, '/', uf.sysname) ufpath , uf.* from User u left outer join Upfile uf on uf.id = u.profileimg where u.id = {id}`,
//     params
//   );

//   try {
//     const [r1] = await conn.execute(
//       'update User set state = state + 1 where id=1'
//     );
// //     console.log('🚀 ~ r1', r1);

//     const { query: q2, queryParams: qp2 } = berryParam(
//       'update User set passwd={@pwd_passwd} where id = {id}',
//       params
//     );
//     const [r2] = await conn.execute(q2, qp2);
// //     console.log('🚀 ~ r2', r2);

// //     // console.log('🚀 ~ query', query, queryParams);
//     // const [rows] = await conn.execute(query, queryParams);
//     conn.execute(query, queryParams).then(([rows]) => {
//       // console.log('qqq>>', err, rows);
//       res.json({ rows });
//     });

//     // pool.releaseConnection(conn);
//     conn.commit();
//   } catch (error) {
//     conn.rollback();
//     console.error('error - ', error);
//   }

//   conn.release();
// });

// const pool = createPool(DbInfo);
// app.get('/mysql/:id', (req, res) => {
//   const params = makeParams(req);
//   pool.getConnection((err, conn) => {
//     // conn.beginTransaction();
//     const { query, queryParams } = berryParam(
//       `select u.*, concat(uf.syspath, '/', uf.sysname) ufpath , uf.* from User u left outer join Upfile uf on uf.id = u.profileimg where u.id = {id}`,
//       params
//     );

// //     // console.log('🚀 ~ query', query, queryParams);
//     conn.execute(query, queryParams, (err, rows) => {
//       console.log(err, rows);
//       res.json({ rows });
//     });

//     pool.releaseConnection(conn);
//   });
// });

// app.get('/mysql2/:id', async (req, res) => {
//   const params = makeParams(req);
//   const db = pool.promise();
//   // `select u.*, concat(uf.syspath, '/', uf.sysname) ufpath , uf.* from User u left outer join Upfile uf on uf.id = u.profileimg where u.id >= {id}`,
//   const { query, queryParams } = berryParam(
//     'update User set state = state + 1 where id = {id}',
//     params
//   );

//   try {
//     // db.getConnection().beginTransaction();
//     const [rows] = await db.execute(query, queryParams);
//     res.json({ rows });
//     // db.commit();
//   } catch (error) {
//     console.error('Error>>', error);
//     // db.rollback();
//     res.status(500).send('Error!!!' + error);
//   }
// });

setupLocalStrategy(app);

app.all('/ogscrapper', (req, res) => {
  ogs({ url: req.query.url }).then(({ error, result }) => {
    if (error) return res.status(500).json({ message: error.message });
    // console.log('rrr>>', result);
    res.json(result);
  });
});

// app.use('/api/:appid/:version/:schemas/:idcmd', );
app.all('/api/:appid/:version/:schemas/:idcmd', (req, res) =>
  api(req, res, redis)
);

app.all('/apiparams/:appid/:version/:schemas/:idcmd', (req, res) => {
  const params = makeParams(req);
  console.log('🚀 ~', params);
  res.json(params);
});

app.get('/hello', (req, res) => {
  res.send('Hello World!!');
});

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// console.log('meta>>', import.meta.url);
const server = app.listen(PORT, () => {
  console.log(`B&M Server listening on port ${PORT}`);
});

server.on('close', () => {
  // redis.end();
  // console.log('🚀 ~ server closed', new Date());
});

const io = new SocketServer(server, {
  cors: {
    origin: AllowHosts,
    credentials: true,
  },
});

// const redisAdapter = require('socket.io-redis');
// io.adapter(redisAdapter(project.redisInfo));

// const socketMap = new Map();
// socketMap.set('<userId>', socket.id);
// socketMap.set('<roomId>', socket.id);

io.sockets.on('connection', (socket) => {
  // // console.log('🚀 ~ real socket started', socket.id);
  // const { token } = socket.handshake.query;
  const square = 'BnmSquare';
  socket.join(square);
  // // console.log('🚀 ~ joined square', square, socket.id);
  socket.emit('message', 'Welcome to B&M');
  // // console.log('🚀 ~ send welcome message to', socket.id);

  socket.on('hello', (data, cb) => {
    // // console.log('🚀 ~ receive hello from', socket.id, data);
    socket.to(square).emit('hello', data);
    // // console.log('🚀 ~ send hello to', socket.id);
    cb('world');
  });

  socket.on('disconnecting', (reason) => {
    console.log('🚀 ~ disconnecting', socket.id, ', reason:', reason);
  });
});

export { server, io };
