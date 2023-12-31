import { Request, Response } from "express"
import { UserModel } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createJWT } from '../utils/auth';

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

type field = 'name' | 'email' | 'password' | 'password_confirmation';
type errorType = 'required' | 'invalid' | 'mismatch';

type TErrorValidatiion = {
    [key: string]: errorType
}

type TForm = {
    [key: string]: string
}

const validateForm = (form: TForm) => {
    let { name, email, password, password_confirmation  } = form;
    let errors: TErrorValidatiion[] = [];

    if (!name) {
        errors.push({ name: "required" });
      }
      if (!email) {
        errors.push({ email: "required" });
      }
      if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid" });
      }
      if (!password) {
        errors.push({ password: "required" });
      }
      if (!password_confirmation) {
        errors.push({
         password_confirmation: "required",
        });
      }
      if (password != password_confirmation) {
        errors.push({ password: "mismatch" });
      }

      return errors;
}

export const register = async ( req: Request, res: Response ) => {
    let { name, email, password, password_confirmation  } = req.body;

    email = email.toLowerCase();

    const errors = validateForm(req.body);

    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    try {
        const user = await UserModel.findOne({email: email});
        
        if (user) {
            if (user.name === name) {
                return res.status(422).json({ error: "Username already exists." });
            }
            else if (user.email === email) {
                return res.status(422).json({ error: "Email already exists." });
            }
        }
        else {
            const user = new UserModel({
              name: name,
              email: email,
              password: password,
            });
            bcrypt.genSalt(10, (err, salt) => { 
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    try {
                        const response = user.save();
                        res.status(200).json({
                            success: true,
                            result: response
                        })
                    } catch (error) {
                        res.status(500).json({ error });
                    }
            });
         });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const login = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        } else {
            try {
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(400).json({ error: "Incorrect password." });
                }

                let access_token = createJWT(
                    user.email,
                    user._id as unknown as  string,
                    parseInt(process.env.ACCESS_TOKEN_DURATION as string)
                );
                jwt.verify(access_token, process.env.TOKEN_SECRET as string, 
                        (error, decoded) => {
                        if (error) {
                            res.status(500).json({ error });
                        }
                        if (decoded) {
                            return res.status(200).json({
                            success: true,
                            token: access_token,
                            user: user
                            });
                        }
                    }
                );
            } catch (error) {
                res.status(500).json({ error });
            }

        }
    } catch (error) {
        res.status(500).json({ error });
    }
}