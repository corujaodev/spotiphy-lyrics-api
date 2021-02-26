import UserRepository from '../repositories/UserRepository';
import request from 'request';
import SpotifyWebApi from 'spotify-web-api-node';
import querystring from 'querystring';
import { authConfig } from '../config/AuthConfig';

export interface SpotifyServiceResponse {
    data?: any;
    redirect: boolean;
    urlRedirect: string;
}

export class SpotifyService {

    userRepository = new UserRepository();
    spotifyApi = new SpotifyWebApi({
        clientId: authConfig.spotifyClientId,
        clientSecret: authConfig.spotifyClientSecret
    });

    public async handleCallback(callbackUrl: string) {

        let resp: SpotifyServiceResponse = {
            data: null,
            redirect: false,
            urlRedirect: ""
        };

        const parameters = callbackUrl.split("?")

        const code = parameters[1].split("&")[0].split("=")[1]
        const state = parameters[1].split("&")[1].split("=")[1]

        const storedState = await this.userRepository.getByState(state);

        if (state === null || state !== storedState.state) {
            const data = {
                "code": code,
                "state": state,
                "storedState": storedState
            };

            resp  = {
                data,
                redirect: false,
                urlRedirect: ""
            }
        } else {

            const authOptions = {
                url: authConfig.spotifyUrltoken || "",
                form: {
                    code: code,
                    redirect_uri: authConfig.spotifyRedirectUri,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(authConfig.spotifyClientId + ':' + authConfig.spotifyClientSecret).toString('base64')),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                json: true
            };

            request.post(authOptions, (error, response, body) => {

                if (!error && response.statusCode === 200) {

                    const access_token = body.access_token;
                    const refresh_token = body.refresh_token;

                    this.spotifyApi.setAccessToken(access_token);
                    this.spotifyApi.setRefreshToken(refresh_token);

                    if (storedState.state.length == 16) {
                        resp  = {
                            data: null,
                            redirect: true,
                            urlRedirect: "/me"
                        }
                    } else {
                        resp = {
                            data: null,
                            redirect: true,
                            urlRedirect: `/${storedState.state}`
                        }
                    }

                } else {
                    resp = {
                        data: null,
                        redirect: true,
                        urlRedirect: `/#${querystring.stringify({
                            error: 'invalid_token'
                        })}`
                    }
                    return response;
                }

                return resp
            });
        }

        return resp
    }
}
