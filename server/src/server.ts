import express from 'express';
const bodyParser = require('body-parser');
import db from './db';
import routes from './routes';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/', routes);

db.dbConnect()
  .then(() => {
    try {
      app.listen(process.env.port || 3000, () => {
        console.log('App is listening on port 3000!');
      });
    } catch (err) {
      console.log(err);
    }
  })
  .catch((err) => console.log(err));
