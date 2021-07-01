import * as axios from 'axios';
import { Request, Response } from 'express';
import User from '../../model/user';

export const getAccessToken = async (data) => {
  const options: axios.AxiosRequestConfig = {
    method: 'POST',
    url: 'https://slack.com/api/oauth.v2.access',
    data,
  };

  const authDetails = await axios.default.request(options);
  return authDetails;
};

export const redirect = async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.user });
  if (!user) {
    return res.status(400).send('you are not logged in');
  }
  if (!req.query.code) {
    return;
  }
  try {
    var data = {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code,
    };

    const response = await getAccessToken(data);

    const slackData = {
      slackId: response.data.authed_user.id,
      slackToken: response.data.access_token,
    };

    user.setSlackData(slackData);

    return res.status(200).send('Success');
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

export const authenticate = async (req: Request, res: Response) => {
  const redirectURL = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=chat:write,channels:manage,chat:write.public&user_scope=users:read,users:read.email&redirect_uri=${process.env.SERVER_URL}/slackAuth/redirect`;
  return res.redirect(304, redirectURL);
};
