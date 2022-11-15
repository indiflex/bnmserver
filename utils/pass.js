import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { user } from '../models/user.js';
import { Db } from './db.js';

export const setupLocalStrategy = (app) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'passwd',
      },
      async (email, passwd, done) => {
        console.log('🚀 ~ passport', email, passwd);

        const db = new Db();
        const user = await db.query(user.login, { email, passwd });
        // db.query('select * from User where emial=');
        // this._localLogin(this._req, this._res, this._params, berrycache, done);
        done(user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  });

  app.post(
    '/auth/bnmwww/users/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );
};
