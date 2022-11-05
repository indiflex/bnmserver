import express from 'express';
import { PORT } from './config.js';
import { hello, api, apiParams } from './routes/api.js';

const app = express();

app.get('/', hello);

// app.get('/api/:appid/:version/:schemas', );
app.all('/api/:appid/:version/:schemas/:idcmd', api);

app.all('/apiparams/:appid/:version/:schemas/:idcmd', apiParams);

// console.log('meta>>', import.meta.url);
const server = app.listen(PORT, () => {
  console.log(`B&M Server listening on port ${PORT}`);
});

export { server };
