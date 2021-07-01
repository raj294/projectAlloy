import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import User from '../model/user';

export const signup = async (req: Request, res: Response) => {
  try {
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.firstName ||
      !req.body.lastName
    ) {
      res.status(400).send('Pass all required params.');
      return;
    }

    const email = req.body.email.toLowerCase();
    const exists = await User.findOne({ email });

    if (exists) {
      res.status(400).send('User already exists with the same email id.');
      return;
    }

    const password = req.body.password;
    if (password.length < 4) {
      return res
        .status(400)
        .send('Password is too short, it must be more than 4 chars.');
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    try {
      await user.save();
      const access_token = sign(
        {
          user: user._id,
        },
        process.env.JWT_SECRET!
      );

      return res.status(200).send({
        accessToken: 'JWT ' + access_token,
        user: user,
      });
    } catch (err) {
      res.status(400).send('Problem signing up!');
      return;
    }
  } catch (err) {
    res.status(400).send(err);
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const password = req.body.password;
  const email = req.body.email.toLowerCase();
  if (!email || !password) {
    return res.status(500).send('Pass email and password both');
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found');
    }

    user.comparePwd(req.body.password, async (err, match) => {
      if (match && !err) {
        const access_token = sign(
          {
            user: user._id,
          },
          process.env.JWT_SECRET!
        );

        return res.status(200).send({
          accessToken: 'JWT ' + access_token,
          user: user,
        });
      } else {
        return res.status(400).send('Wrong password');
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
    return;
  }
};
