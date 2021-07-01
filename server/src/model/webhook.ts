import { Document, model, Schema, Types } from 'mongoose';
import { ObjectID } from 'mongodb';
const { ObjectId } = Types;

const WebhookSchema = new Schema({
  userId: { type: ObjectId },
  webhookId: {
    type: String,
    required: true,
  },
});

interface IWebhookSchema extends Document {
  userId: ObjectID;
  webhookId: string;
}

const Webhook = model<IWebhookSchema>('Webhook', WebhookSchema);
export default Webhook;
