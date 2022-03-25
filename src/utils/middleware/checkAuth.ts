import { Response, Request, NextFunction } from 'express';
import { verify, Secret } from 'jsonwebtoken';

export const checkAuth = (roles: string[] | null) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(roles);

      //auth Header here is "Bearer accessToken"
      const authHeader = req.header('Authorization');
      const accessToken = authHeader && authHeader.split(' ')[1];

      if (!accessToken)
        return res.status(401).json({
          code: 401,
          success: false,
          message: 'Not authenticated to perform operations',
        });

      //Decode user
      const decodeUser = verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret);
      console.log(decodeUser);

      return next();
    } catch (error) {
      return res.status(401).json({
        code: 401,
        success: false,
        message: 'Error authenticating user',
      });
    }
  };
};
