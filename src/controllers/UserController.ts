
import { UserService } from '../services/UserService';
import { Body, Controller, Get, Path, Query, Post, Route, SuccessResponse, Put, Security, Delete } from "tsoa";
import HttpStatus from 'http-status-codes';

const userService = new UserService();

@Route("user")
export class UserController extends Controller {
    
    @Security("jwt")
    @Get("all")
    public async getAll(): Promise<any> {
        return userService.getAll();
    }

    @Security("jwt")
    @Get("blocked")
    public async getBlocked(): Promise<any> {
        return userService.getBlocked();
    }

    @Security("jwt")
    @Get("{_id}")
    public async getUser(
        @Path() _id: string,
    ): Promise<any> {
        return userService.get(_id);
    }

    @Security("jwt")
    @Delete()
    public async deleteUser(
        @Query() _id: string,
    ): Promise<any> {
        this.setStatus(HttpStatus.OK);
        return userService.delete(_id);
    }

    @Security("jwt")
    @SuccessResponse(HttpStatus.CREATED, HttpStatus.getStatusText(HttpStatus.CREATED))
    @Post()
    public async createUser(
        @Body() requestBody: any
    ): Promise<any> {
        
        const response = userService.create(requestBody);
        this.setStatus(HttpStatus.CREATED);
        return response;
    }

    @Security("jwt")
    @SuccessResponse(HttpStatus.CREATED, HttpStatus.getStatusText(HttpStatus.NO_CONTENT))
    @Put()
    public async updateUser(
        @Body() requestBody: any
    ): Promise<any> {
        const response = userService.update(requestBody);
        this.setStatus(HttpStatus.NO_CONTENT);
        return response;
    }
    
}