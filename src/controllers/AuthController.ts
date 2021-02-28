
import { Controller, Route, SuccessResponse, Post, Body } from "tsoa";
import HttpStatus from 'http-status-codes';
import querystring from 'querystring';

import { authConfig } from '../config/AuthConfig';

import { UserService } from "../services/UserService";
import { SpotifyService } from '../services/SpotifyService';
import { PuppeteerService } from '../services/PuppeteerService';
import { LoginRequest } from '../models/LoginRequest';

const userService = new UserService();
const spotifyService = new SpotifyService();
const puppeteerService = new PuppeteerService();

@Route("authenticate")
export class AuthController extends Controller {
    @SuccessResponse(HttpStatus.OK, HttpStatus.getStatusText(HttpStatus.OK))
    @Post("login")
    public async login(
        @Body() requestBody: LoginRequest
    ): Promise<any> {
        const { spotifyUser, spotifyPassword } = requestBody
        await userService.create({ userEmail: spotifyUser, state: spotifyUser });
        
        const fullUrlLogin = `${authConfig.spotifyUrlAuthorize}${this.getUrl(spotifyUser)}`;
        const urlCallback = await puppeteerService.getCallbackData(fullUrlLogin, spotifyUser, spotifyPassword);

        const callback = await spotifyService.handleCallback(urlCallback)

        return callback;
    }

    @Post("getMyCurrentPlayingTrack")
    public async getMyCurrentPlayingTrack (
        @Body() requestBody: LoginRequest
    ): Promise<any> {
        const { spotifyUser } = requestBody
        const user = await userService.getByEmail(spotifyUser)
        let currentPlayingTrack = null;

        if(user != null) {
            currentPlayingTrack = await spotifyService.getMyCurrentPlayingTrack(user);
        }

        console.log({ currentPlayingTrack });
        return currentPlayingTrack;
    }



    private getUrl(spotifyUser: string) {
        const querystringValue = {
            state: spotifyUser,
            response_type: 'code',
            client_id: authConfig.spotifyClientId,
            scope: authConfig.spotifyScope,
            redirect_uri: authConfig.spotifyRedirectUri
        }

        const url = querystring.stringify(querystringValue);

        return url;
    }

}
