
import { Controller, Route, SuccessResponse, Get } from "tsoa";
import HttpStatus from 'http-status-codes';
import querystring from 'querystring';


import { StringUtil } from '../utils/StringUtil';
import { authConfig } from '../config/AuthConfig';

import { UserService } from "../services/UserService";
import { SpotifyService } from '../services/SpotifyService';
import { PuppeteerService } from '../services/PuppeteerService';

const stringUtil = new StringUtil();
const userService = new UserService();
const spotifyService = new SpotifyService();
const puppeteerService = new PuppeteerService();

@Route("authenticate")
export class AuthController extends Controller {
    @SuccessResponse(HttpStatus.OK, HttpStatus.getStatusText(HttpStatus.OK))
    @Get("login")
    public async login(): Promise<any> {
        const state = stringUtil.generateRandomString(16);
        await userService.create({ state });
        const user = await userService.getByState(state);

        const querystringValue = {
            state: user.state,
            response_type: 'code',
            client_id: authConfig.spotifyClientId,
            scope: authConfig.spotifyScope,
            redirect_uri: authConfig.spotifyRedirectUri
        }

        const url = querystring.stringify(querystringValue);
        const fullUrlLogin = `${authConfig.spotifyUrlAuthorize}${url}`;
        const urlCallback = await puppeteerService.getCallbackData(fullUrlLogin);

        const callback = await spotifyService.handleCallback(urlCallback)

        return callback;
    }

}
