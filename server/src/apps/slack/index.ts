import * as axios from 'axios';
import User from '../../model/user';

export const sendData = async (userId, text) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      const slackData = user.getSlackDataData();
      if (slackData.slackToken && slackData.slackId) {
        const data = {
          token: slackData.slackToken,
          channel: slackData.slackId,
          text: text,
        };

        const options: axios.AxiosRequestConfig = {
          method: 'POST',
          url: 'https://slack.com/api/chat.postMessage',
          data,
        };

        await axios.default.request(options);
        return 'success';
      }
    } else {
      return undefined;
    }
  } catch (err) {
    console.log(err);
  }
};
