import { expect, test } from "vitest";
import { errorHandler } from "./errorHandler";
import z from "zod";
import e from "express";
import { HttpError } from "./HttpError";

test("errorHandler should return 400 for ZodError", () => {
  try {
    z.object({ name: z.string() }).parse({ name: 123 });
  } catch (error) {
    errorHandler(
      error,
      {} as e.Request,
      {
        status: (code: number) => ({
          json: (data) => {
            expect(code).toBe(400);
            expect(data.message).toBe("Validation failed");
          },
        }),
      } as e.Response,
      () => {},
    );
  }
});

test("errorHandler should return 500 for unknown error", () => {
  errorHandler(
    new Error("Unknown error"),
    {} as e.Request,
    {
      status: (code: number) => ({
        json: (data) => {
          expect(code).toBe(500);
          expect(data.message).toBe("Internal Server Error");
        },
      }),
    } as e.Response,
    () => {},
  );
});

test("errorHandler should return custom status and message for HttpError", () => {
  errorHandler(
    new HttpError(404, "Not found"),
    {} as e.Request,
    {
      status: (code: number) => ({
        json: (data) => {
          expect(code).toBe(404);
          expect(data.message).toBe("Not found");
        },
      }),
    } as e.Response,
    () => {},
  );
});
