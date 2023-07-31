import jwt from 'jsonwebtoken';

export const createJWT = (email: string, userId: string, duration: number) => {
    const payload = {
        email,
        userId,
        duration
     };

     return jwt.sign(payload, process.env.TOKEN_SECRET as string, {
       expiresIn: duration,
     });
}