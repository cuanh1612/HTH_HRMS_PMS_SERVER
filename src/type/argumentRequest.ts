import { NextFunction, Request, Response } from 'express';

type argumentRequest = {
  req: Request;
  res: Response;
  next: NextFunction;
};

export default argumentRequest
