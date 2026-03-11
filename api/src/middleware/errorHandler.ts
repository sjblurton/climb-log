import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  console.log("ERROR HANDLER:", JSON.stringify(err, null, 2));
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

  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
}
