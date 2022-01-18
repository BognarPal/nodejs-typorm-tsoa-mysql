import {Body, Controller, Get, Path, Post, Query, Route, SuccessResponse } from "tsoa";
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
  
  }