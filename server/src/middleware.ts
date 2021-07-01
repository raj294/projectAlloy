import * as express from 'express';
const jwt = require('jsonwebtoken');
import User from "./model/user";

export const middleware = async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  let accessToken = req.headers['authorization'];
  if (!accessToken) {
    res.status(400).send('Unauthorised.');
    return;
  }
  accessToken = accessToken.replace('JWT ', '');
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: decoded.user });
  if (user == undefined) {
    res.status(400).send('Unauthorised.');
    return;
  } else {
    next();
  }
}