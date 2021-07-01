import { Request, Response } from 'express';
import User from '../model/user';
import Webhook from '../model/webhook';
import { deleteWebhook, createWebhook } from '../apps/shopify';
import { sendData } from '../apps/slack';

export const activate = async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.user });
  if (!user) {
    return res.status(400).send('you are not logged in');
  }
  const activated = await createWebhook(req.user);
  if (activated) {
    const wbh = new Webhook({
      userId: req.user,
      webhookId: activated,
    });
    wbh.save();
    return res.status(200).send('Activated!');
  } else {
    return res.status(400).send('Something went wrong.');
  }
};

export const deactivate = async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.user });
  if (!user) {
    return res.status(400).send('you are not logged in');
  }
  const deactivated = await deleteWebhook(req.user);
  if (deactivated) {
    await Webhook.findByIdAndDelete({ userId: req.user });
    return res.status(200).send('Deactivated!');
  } else {
    return res.status(400).send('Something went wrong.');
  }
};

export const execute = async (req: Request, res: Response) => {
  const data = req.body;
  const webHookId = req.headers['X-Shopify-Webhook-Id'];
  const webhook = Webhook.findOne({ _id: webHookId });
  if (webhook) {
    if (data.order && Number(data.order.total_price) > 100) {
      const msg = await sendData(
        webhook.userId,
        `OrderId: ${data.order.id} exceeded $100 set limit!!!`
      );
      if (!msg) {
        console.log('ERROR:: Cannot send message!');
      }
    }
  } else {
    console.log('ERROR:: Cannot find webhook record.');
  }
};
