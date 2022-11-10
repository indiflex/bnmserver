import express from 'express';
import ogs from 'open-graph-scraper';
import { PORT } from './config.js';
import { hello, api, apiParams } from './routes/api.js';

const app = express();

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

// console.log('meta>>', import.meta.url);
const server = app.listen(PORT, () => {
  console.log(`B&M Server listening on port ${PORT}`);
});

export { server };
