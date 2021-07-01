import { Document, model, Schema, Types } from 'mongoose';
import { ObjectID } from 'mongodb';
import { enc, AES } from 'crypto-js';
const { ObjectId } = Types;

const CredentialSchema = new Schema({
  userId: { type: ObjectId },
  type: {
    type: String,
    required: true,
  },
  data: { type: String },
});

interface ICredentialSchema {
  userId: ObjectID;
  type: string;
  data: string;
  setData: (data: { [key: string]: string }) => void;
  getData: () => { [key: string]: string };
}

CredentialSchema.method({
  setData: function (data: { [key: string]: string }) {
    const ciphertext = AES.encrypt(
      JSON.stringify(data),
      process.env.ENCRYPTION_KEY!
    ).toString();
    this.data = ciphertext;
  },

  getData: function () {
    if (this.data) {
      const bytes = AES.decrypt(this.data, process.env.ENCRYPTION_KEY!);
      const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
      return decryptedData as { [key: string]: string };
    }
  },
});

const Credential = model<ICredentialSchema>('Credential', CredentialSchema);
export default Credential;
