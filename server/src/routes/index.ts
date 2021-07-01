import express from 'express';
import passport from 'passport';
import * as auth from '../controller/auth';
import * as flow from '../controller/flow';
import * as slackAuth from '../apps/slack/auth';
import * as shopifyAuth from '../apps/shopify/auth';
import { middleware } from '../middleware';

const router = express.Router();

router.get(
  '/slackAuth/redirect',
  middleware,
  passport.authenticate('jwt', { session: false }),
  slackAuth.redirect
);

router.get(
  '/shopifyAuth/redirect',
  middleware,
  passport.authenticate('jwt', { session: false }),
  shopifyAuth.redirect
);

router.get('/auth/signup', auth.signup);

router.get('/auth/login', auth.login);

router.get(
  '/connectSlack',
  middleware,
  passport.authenticate('jwt', { session: false }),
  slackAuth.authenticate
);

router.get(
  '/connectShopify',
  middleware,
  passport.authenticate('jwt', { session: false }),
  shopifyAuth.authenticate
);

router.get(
  '/activateFlow',
  middleware,
  passport.authenticate('jwt', { session: false }),
  flow.activate
);

router.get(
  '/deActivateFlow',
  middleware,
  passport.authenticate('jwt', { session: false }),
  flow.deactivate
);

router.post(
  '/execute',
  middleware,
  passport.authenticate('jwt', { session: false }),
  flow.execute
);

export default router;
