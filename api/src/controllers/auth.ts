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

export const signup = async ( req: Request, res: Response ) => {
    let { name, email, password, password_confirmation  } = req.body;

    email = email.toLowerCase();

    const errors = validateForm(req.body);

    console.log('signup | req.body: ', req.body);

    if (errors.length > 0) {
        console.log('signup | errors: ', errors);
        return res.status(422).json({ errors: errors });
    }

    try {
        console.log('-- email: ', email);
        const user = await UserModel.findOne({email: email});
        console.log('-- user: ', user);
        
        if(user){
            console.log('signup | email already exists:');
            return res.status(422).json({ errors: [{ user: "email already exists" }] });
         }
         else {
            const user = new UserModel({
              name: name,
              email: email,
              password: password,
            });
            bcrypt.genSalt(10, (err, salt) => { 
                console.log('salt: ', salt);
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
                        console.error('genSalt > hash | error:', error);
                        res.status(500).json({
                            errors: [{ error }]
                        });
                    }
            });
         });
        }
    } catch (error) {
        res.status(500).json({
            errors: [{ error }]
        });
    }
}

export const signin = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    // Add form validation

    try {
        // Find user
        const user = await UserModel.findOne({ email: email });
        
        // If user not found, respond w/ error 404
        if (!user) {
            return res.status(404).json(
                {
                    errors: [{ user: "not found" }],
                }
            );
        } else {
            // Else check if password matches
            try {
                const isMatch = bcrypt.compare(password, user.password);
                // If not match, respond w/ error 400
                if (!isMatch) {
                    return res.status(400).json(
                        {
                            errors: [{ password: "incorrect" }] 
                        }
                    );
                }
                // else create Token
                let access_token = createJWT(
                    user.email,
                    user._id as unknown as  string,
                    3600
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
                            message: user
                            });
                        }
                    }
                );
            } catch (error) {
                console.log('error: ', error);
                res.status(500).json({ error });
            }

        }
    } catch (error) {
        res.status(500).json({
            errors: [{ error }]
        });
    }
}