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
        //TODO: token lejárat ellenőrzése
        var user = await getCustomRepository(AuthRepository).checkToken(token.toString());
        var matchedRoles = user.roles.filter(r => scopes?.includes(r.name) );
        console.log(matchedRoles);
        if (matchedRoles.length > 0) {
          resolve(user)
        }
        reject(new OperationError("NOT_AUTHORIZED", HttpStatusCode.UNAUTHORIZED));
      }      
    });
  }
  else {
    return new Promise((resolve, reject) => {
        resolve(undefined)
    });
  }
}