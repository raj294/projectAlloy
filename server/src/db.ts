import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const URI = process.env.CONNECTION_URI;
const dbConnect = async () => {
  mongoose.connect(
    URI!,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log('DB CONNECTED!');
    }
  );

  mongoose.connection.on('connected', () => {
    console.log('Connected');
  });

  mongoose.connection.on('error', (err) => {
    console.log(`Mongoose default connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });
};

const dbDisconnect = () => mongoose.connection.close();

export default { dbConnect, dbDisconnect };
