import { extendJson } from './utils.js';

export const makeParam = (req, otherParams) => {
  const { body, query, params, headers } = req;
  return extendJson(
    { body, query, params, headers },
    extendJson(body, query, params, otherParams)
  );
};

export const setSession = (app, req) => {};
