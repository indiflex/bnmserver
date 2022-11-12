import { makeParam } from '../utils/httpUtils.js';

// const create = (req, res, apiParams) => {};
// const read = (req, res, params) => {};
// const update = (req, res) => {};
// const delete = (req, res) => { };

const execute = (req, res) => {
  console.log('res>>>', res);
  return req.params;
  //   switch (req.method) {
  //     case 'GET':
  //       break;
  //     default:
  //       return;
  //   }
};

// .../api/:appid/:version/:schemas/:idcmd?searchStr=abc
export const api = (req, res) => {
  console.log('params>>', req.params);
  // const { appid, version, schemas, idcmd } = req.params;
  const { idcmd } = req.params;
  if (req.method === 'GET' && isNaN(Number(idcmd))) {
    res.json({ xx: 1 });
  } else {
    res.json(execute(req, res));
  }
};

// @ToDo: move to utils/httputils.js
// param & query sample
export const apiParams = (req, res) => {
  // console.log('params>>', req.params);
  // console.log('cookies>>', req.cookies);
  // const { appid, version, schemas, idcmd } = req.params;
  // res.json({ appid, version, schemas, idcmd, query: req.query });
  // sele... where id=:params.id
  const params = makeParam(req);
  console.log('🚀 ~', params);
  res.json(params);
};

export const hello = (req, res) => {
  res.send('Hello World!!');
};
