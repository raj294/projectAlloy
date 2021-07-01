import { Document, model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
});

export interface IUserSchema extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  slackData: string;
  comparePwd: (
    pwd: string,
    callback: (err: Error | null, match?: boolean) => void
  ) => void;
  setSlackData: (data: { [key: string]: string }) => void;
  getSlackDataData: () => { [key: string]: string };
}

UserSchema.pre('save', function (next) {
  let user = this as IUserSchema;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePwd = function (
  password: string,
  callback: (error: Error | null, match?: boolean) => void
) {
  bcrypt.compare(password, this.password, function (error, match) {
    if (error) {
      return callback(error);
    }
    callback(null, match);
  });
};

const User = model<IUserSchema>('User', UserSchema);
export default User;
