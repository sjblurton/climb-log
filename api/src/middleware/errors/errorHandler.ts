import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";
import { HttpError } from "./HttpError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: z.prettifyError(err),
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Internal Server Error" });
};
