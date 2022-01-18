import * as express from "express";

import { getCustomRepository } from "typeorm";
import { AuthRepository } from "../repositories/auth.repository";
import { HttpStatusCode } from "./http-status-code";
import { OperationError } from "./operation-error";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "token") {
    const token = request.headers["Authorization"] || request.headers["authorization"];        
    return new Promise(async (resolve, reject) => {
      if (!token) {
        reject(new OperationError("NOT_AUTHORIZED", HttpStatusCode.UNAUTHORIZED));
      }
      else {
        const session = await getCustomRepository(AuthRepository).getSession(token.toString());
        if (!session ) {
          reject(new OperationError("NOT_AUTHORIZED", HttpStatusCode.UNAUTHORIZED));
        } else {
          let validTo = new Date()
          validTo.setTime(session.lastAccess.getTime() + parseInt(process.env.SESSION_TIMEOUT_MINUTE as string, 10) * 60 * 1000);
          if (validTo < new Date()) {
            reject(new OperationError("NOT_AUTHORIZED", HttpStatusCode.UNAUTHORIZED));
          }
          const matchedRoles = session.user.roles.filter(r => scopes?.includes(r.name) );
          if (matchedRoles.length > 0) {
            resolve(session.user)
          }
          reject(new OperationError("NOT_AUTHORIZED", HttpStatusCode.UNAUTHORIZED));
        }
      }      
    });
  }
  else {
    return new Promise((resolve, reject) => {
        resolve(undefined)
    });
  }
}

export async function updateLastAccessDate( 
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
  ) {
    const token = request.headers["Authorization"] || request.headers["authorization"];     
    if (token) {
      await getCustomRepository(AuthRepository).updateSessionLastAccessDate(token.toString());
    }
    next();
  }
