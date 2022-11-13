import express from 'express';

import ogs from 'open-graph-scraper';
import { createPool } from 'mysql2';
import { Server as SocketServer } from 'socket.io';
import { PORT, DbInfo, AllowHosts } from './config.js';
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
  console.log('🚀 ~ real socket started', socket.id);
  // const { token } = socket.handshake.query;
  const square = 'BnmSquare';
  socket.join(square);
  console.log(socket.id + ' joined square!');
  socket.emit('message', 'Welcome to B&M');
  console.log('🚀 ~ send welcome message to', socket.id);

  socket.on('hello', (data, cb) => {
    console.log('🚀 ~ receive hello from', socket.id, data);
    socket.to(square).emit('hello', data);
    console.log('🚀 ~ send hello to', socket.id);
    cb('world');
  });

  socket.on('disconnecting', (reason) => {
    console.log('🚀 ~ disconnecting', socket.id, ', reason:', reason);
  });
});

export { server, io };
