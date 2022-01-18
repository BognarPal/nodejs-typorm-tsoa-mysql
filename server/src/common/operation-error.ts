import { HttpStatusCode } from "./http-status-code";
import * as core from 'express-serve-static-core';
import * as express from "express";

export type OperationErrorMessage =
  | "UNKNOWN_ERROR"
  | "EMAIL_IN_USE"
  | "NOT_FOUND"
  | "INVALID_EMAIL_OR_PASSWORD"
  | "INVALID_TOKEN"
  | "NOT_AUTHORIZED";

export class OperationError extends Error {
  constructor(message: OperationErrorMessage, readonly status: HttpStatusCode) {
    super(message);
  }

  static addErrorHandler(    
      err: unknown,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
      ): express.Response | void {
      if (err instanceof OperationError) {
        console.warn(`Caught Operational Error for ${req.path}:`, err.message, err.stack);
        return res.status(err.status).json({
          message: err.message == 'INVALID_EMAIL_OR_PASSWORD' ? 'Hibás felhasználónév vagy jelszó' : err.message
        });
      }
      if (err instanceof Error) {
        console.warn(`Error: ${req.path}:`, err.message, err.stack);
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
      next();
  }
}