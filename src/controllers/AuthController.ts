
import { AuthService } from '../services/AuthService';
import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
import HttpStatus from 'http-status-codes';

const authService = new AuthService();

@Route("authenticate")
export class AuthController extends Controller {
    @SuccessResponse(HttpStatus.CREATED, HttpStatus.getStatusText(HttpStatus.CREATED))
    @Post()
    public async login(
        @Body() requestBody: any
    ): Promise<any> {  
        const {email, password} = requestBody
        const user = await authService.login(email, password);
        this.setStatus(HttpStatus.OK);
        return user;
    }

    @SuccessResponse(HttpStatus.OK, HttpStatus.getStatusText(HttpStatus.OK))
    @Post("validate-token")
    public async validateToken(
        @Body() requestBody: any
    ): Promise<any> {  
        const isValid = await authService.validateToken(requestBody);
        this.setStatus(HttpStatus.OK);
        return isValid;
    }
}