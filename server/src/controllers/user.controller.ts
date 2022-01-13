import {Body, Controller, Get, Path, Post, Query, Route, SuccessResponse } from "tsoa";
import { Connection, createConnection, getCustomRepository } from "typeorm";
import { UserModel } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
  
  @Route("users")
  export class UserController extends Controller {
    
     @Get("{id}")
    public async getUserById(@Path() id: number): Promise<UserModel> {        
        return await getCustomRepository(UserRepository).getById(id)
    }
  
    @Get()
    public async getAllUsers(): Promise<UserModel[]> {
        return await getCustomRepository(UserRepository).getAll();
    }

    /*
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
      @Body() requestBody: UserCreationParams
    ): Promise<void> {
      this.setStatus(201); // set return status 201
      new UsersService().create(requestBody);
      return;
    }
    */
  }