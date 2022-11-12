import express from 'express';

import bodyParser from 'body-parser';
import expressSession from 'express-session';
import { createClient } from 'redis';

import ogs from 'open-graph-scraper';
import { PORT, RedisInfo, SECRET } from './config.js';
import { hello, api, apiParams } from './routes/api.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: SECRET,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const client = createClient(RedisInfo);
client.connect().then(() => {
  console.log('getConnect');
});

app.get('/redis', async (req, res) => {
  try {
    client.on('connect', () => console.log('Redis Connected!'));
    client.on('disconnect', () => console.log('Redis Disconnected!'));
    client.on('error', (error) => console.log('Redis Error>>', error));

    const k = 'key01';
    // const v = 'value11';
    // client.set(k, v);
    client.get(k, (err, data) => {
      console.log(err, data);
      res.json({ k: data });
    });
  } catch (error) {
    console.error(error);
  } finally {
    // client.disconnect();
  }
});

app.get('/', hello);

const AllowHosts = ['http://localhost:5173', 'http://localhost:5174'];

app.all('/ogscrapper', (req, res) => {
  if (AllowHosts.includes(req.headers.origin))
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  else res.header('Access-Control-Allow-Origin', AllowHosts[0]);
  // res.header('Access-Control-Allow-Origin', '*');

  res.header('Access-Control-Allow-Credentials', true); //ajax for diff domain
  // res.header(
  //   'Access-Control-Allow-Headers',
  //   'Origin, X-Requested-With, Content-Type, Accept, Authorization, SocketID'
  // );
  res.header('Access-Control-Allow-Headers', 'SocketID');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, PATCH, PUT, POST, DELETE, OPTIONS'
  );

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

export { server };
