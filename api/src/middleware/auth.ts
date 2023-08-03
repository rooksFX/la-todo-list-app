import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export interface CustomRequest extends Request {
 token: string | JwtPayload;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader as string)?.split(' ')[1] || '';

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
        (req as CustomRequest).token = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: error });
    }
}

export default auth;