import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validateBody = <T>(schema: ZodType<T>) => {
  return (req: Request, _: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
};
