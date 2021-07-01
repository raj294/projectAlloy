import * as axios from 'axios';
import { Request, Response } from 'express';
import { ObjectID } from 'mongodb';
import User from '../../model/user';
import Credential from '../../model/credential';

export const getAccessToken = async (data, store) => {
  const options: axios.AxiosRequestConfig = {
    method: 'POST',
    url: `https://${store}/admin/oauth/access_token`,
    data,
  };

  const authDetails = await axios.default.request(options);
  return authDetails;
};

export const authenticate = async (req: Request, res: Response) => {
  const store = req.query.store;
  const scopes = 'read_all_orders,read_orders';

  if (store) {
    const storeURL = `${store}.myshopify.com`;
    let url = `https://${storeURL}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_CLIENT_ID}&scope=${scopes}&redirect_uri=${process.env.API_SERVER}/connectShopify`;
    return res.redirect(302, url);
  } else {
    return undefined;
  }
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
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code: req.query.code,
    };

    const response = await getAccessToken(data, req.query.shop);

    const shopifyData = {
      slackId: response.data.access_token,
      store: req.query.shop,
    };

    const credential = await Credential.findOne({
      type: 'shopify',
      userId: new ObjectID(req.user),
    });

    if (credential) {
      credential.setData(shopifyData);
      credential.save();
    } else {
      const cred = new Credential({
        type: 'shopify',
        userId: new ObjectID(req.user),
      });
      cred.setData(shopifyData);
      cred.save();
    }

    return res.redirect(302, `${process.env.CLIENT_URL}`);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};
