import * as axios from 'axios';
import User from '../../model/user';
import Credential from '../../model/credential';

export const createWebhook = async (
  userId: string
): Promise<string | undefined> => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return undefined;
  }
  const credentials = await Credential.findOne({
    type: 'shopify',
    userId: userId,
  });
  if (!credentials) {
    return undefined;
  }
  const credentialData = credentials.getData();
  const endpoint = `/webhooks.json`;
  const body = {
    webhook: {
      topic: 'orders/create',
      address: '/webhooks.json',
      format: 'json',
    },
  };

  let webhookData;
  try {
    const options: axios.AxiosRequestConfig = {
      headers: { 'X-Shopify-Access-Token': credentialData.accessToken },
      method: 'POST',
      url: `https://${credentialData.subdomain}/admin/api/2021-04${endpoint}`,
      data: body,
    };

    webhookData = await axios.default.request(options);
  } catch (error) {
    console.log(error);
    return undefined;
  }

  if (webhookData.data.webhook && webhookData.data.webhook.id) {
    return webhookData.data.webhook.id;
  } else {
    return undefined;
  }
};

export const deleteWebhook = async (
  userId: string
): Promise<string | undefined> => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return undefined;
  }
  const credentials = await Credential.findOne({
    type: 'shopify',
    userId: userId,
  });
  if (!credentials) {
    return undefined;
  }
  const credentialData = credentials.getData();
  const endpoint = `/webhooks.json`;
  const body = {
    webhook: {
      topic: 'orders/create',
      address: '/webhooks.json',
      format: 'json',
    },
  };

  let webhookData;
  try {
    const options: axios.AxiosRequestConfig = {
      headers: { 'X-Shopify-Access-Token': credentialData.accessToken },
      method: 'POST',
      url: `https://${credentialData.subdomain}/admin/api/2021-04${endpoint}`,
      data: body,
    };

    webhookData = await axios.default.request(options);
  } catch (error) {
    console.log(error);
    return undefined;
  }

  if (webhookData.data.webhook && webhookData.data.webhook.id) {
    return webhookData.data.webhook.id;
  } else {
    return undefined;
  }
};
