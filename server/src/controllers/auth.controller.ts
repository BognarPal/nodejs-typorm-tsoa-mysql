import * as express from "express";
import { Body, Controller, Get, Path, Post, Query, Route, Security, SuccessResponse, Request } from "tsoa";
import { Connection, createConnection, getCustomRepository } from "typeorm";
import { LoginModel } from "../models/login.model";
import { LoginResponseModel } from "../models/login.response.model";
import { RegistrationModel } from '../models/registration.model';
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

  @Post("registration")
  public async regisztration(@Body() model: RegistrationModel): Promise<LoginResponseModel> {
    return await getCustomRepository(AuthRepository).registerUser(model);
  }

}