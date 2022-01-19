import * as express from "express";
import { Body, Controller, Get, Path, Post, Query, Route, Security, SuccessResponse, Request } from "tsoa";
import { Connection, createConnection, getCustomRepository } from "typeorm";
import { LoginModel } from "../models/login.model";
import { LoginResponseModel } from "../models/login.response.model";
import { AuthRepository } from "../repositories/auth.repository";

@Route("auth")
export class AuthController extends Controller {

  @Post("login")
  public async login(@Body() model: LoginModel): Promise<LoginResponseModel> {
    return await getCustomRepository(AuthRepository).login(model);
  }

  @Get("checktoken")
  @Security('token')
  public async CheckToken(@Request() request: express.Request): Promise<boolean> {
    // const token = request.headers["Authorization"] || request.headers["authorization"];
    // if (token) {
    //   const session = await getCustomRepository(AuthRepository).getSession(token.toString());
    //   if (session) {
    //     let validTo = new Date()
    //     validTo.setTime(session.lastAccess.getTime() + parseInt(process.env.SESSION_TIMEOUT_MINUTE as string, 10) * 60 * 1000);

    //     return new LoginResponseModel({
    //       email: session.user.email,
    //       name: session.user.name,
    //       roles: session.user.roles.map(r => r.name),
    //       token: session.token,
    //       validTo: validTo
    //     });
    //   }
    // }
    // return undefined;
    return true;
  }

  @Post("logout")
  public async Logout(@Request() request: express.Request): Promise<boolean> {
    const token = request.headers["Authorization"] || request.headers["authorization"];
    if (token) {
      return await getCustomRepository(AuthRepository).deleteSession(token.toString());
    }
    return true;
  }

}