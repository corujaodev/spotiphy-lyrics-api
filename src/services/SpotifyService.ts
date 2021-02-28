import request from 'request';
import SpotifyWebApi from 'spotify-web-api-node';
import querystring from 'querystring';
import { authConfig } from '../config/AuthConfig';

import { UserService } from './UserService';
import Messages from '../models/errors/Messages';
import { Error } from '../models/errors/Error';
import { User } from '../database/schemas/User';
import StringUtil from '../utils/StringUtil';


const getLyrics = require('genius-lyrics-api/lib/getLyrics');

const stringUtil = new StringUtil();

export interface SpotifyServiceResponse {
    data?: any;
    redirect: boolean;
    urlRedirect: string;
}

export class SpotifyService {

    userService = new UserService();
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
        const state = parameters[1].split("&")[1].split("=")[1].replace("%40", "@")

        const userStored: User = await this.userService.getByEmail(state);

        if (state === null || state !== userStored.state) {
            const data = {
                "code": code,
                "state": state,
                "storedState": userStored.state
            };
            console.log("Resp Linha 43")
            resp = {
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

            request.post(authOptions, async (error, response, body) => {

                if (!error && response.statusCode === 200) {

                    const access_token = body.access_token
                    const refresh_token = body.refresh_token

                    this.spotifyApi.setAccessToken(access_token)
                    this.spotifyApi.setRefreshToken(refresh_token)

                    if (userStored.state.length > 0) {

                        const userProfile: any = await this.getMe();

                        userStored.userFollowers = userProfile.body.followers.total
                        userStored.userName = userProfile.body.display_name
                        userStored.userProfilePicture = userProfile.body.images[0].url
                        userStored.token = access_token
                        userStored.refreshToken = refresh_token
                        userStored.state = stringUtil.generateRandomString(16)
                        userStored.code = code
                        userStored.userEmail = state

                        await this.userService.update(userStored)

                        resp = {
                            data: null,
                            redirect: true,
                            urlRedirect: "/me"
                        }
                        return resp
                    } else {
                        console.log("Resp Linha 83")
                        resp = {
                            data: null,
                            redirect: true,
                            urlRedirect: `/${userStored.state}`
                        }
                        return resp
                    }

                } else {
                    console.log("Resp Linha 92")
                    resp = {
                        data: null,
                        redirect: true,
                        urlRedirect: `/#${querystring.stringify({
                            error: 'invalid_token'
                        })}`
                    }
                    return resp
                }
            });
        }

        return resp
    }

    public refrestoken(refresh_token: string) {

        const authOptions = {
            url: authConfig.spotifyUrltoken || "",
            headers: { 'Authorization': 'Basic ' + (new Buffer(authConfig.spotifyClientId + ':' + authConfig.spotifyClientSecret).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                this.spotifyApi.setRefreshToken(body.access_token)
            }
        });
    }

    public getArtist(artistId: string) {
        this.spotifyApi.getArtist(artistId).then(
            (data) => {
                return data.body
            },
            (err) => {
                return this.handleError(err)
            }
        );
    }

    public async getMe() {
        return await this.spotifyApi.getMe();
    }

    public skipToNext() {
        let response = null;
        this.spotifyApi.skipToNext().then(
            (data) => {
                response = data.body
            },
            (err) => {
                response = this.handleError(err)
            }
        );

        return response;
    }

    public async getMyCurrentPlayingTrack(user: User) {
        console.log("getMyCurrentPlayingTrack for user ", user)
        let response = null;
        this.setCredentials(user);
        await this.spotifyApi.getMyCurrentPlayingTrack().then((data) => {
            response = data.body.item;
        }, (err) => {
            response = this.handleError(err)
        });

        return response;
    }

    public getCurrentPlayingWithDetails() {
        let response = null;
        this.spotifyApi.getMyCurrentPlayingTrack({})
            .then(async (data) => {
                const trackId = data.body.item ? data.body.item.id : "";
                const trackDetails = await this.getTrackDetails(trackId)
                response = trackDetails;
            }, (err) => {
                response = this.handleError(err)
            });

        return response;
    }

    public getMyDevices() {
        let response = null;
        this.spotifyApi.getMyDevices().then((data) => {
            response = data.body.devices;
        }, (err) => {
            response = this.handleError(err)
        });

        return response;
    }

    public getCurrentPlayingLyric() {
        let response = null;
        this.spotifyApi.getMyCurrentPlaybackState({})
            .then(async (data) => {
                if (data.statusCode == 204) {
                    return Messages.NOTHING_IS_PLAYING
                } else {
                    const artist = data.body.item?.artists[0].name
                    const song = data.body.item?.name

                    this.getLyric(artist, song).then((lyric: any) => {
                        if (lyric.length > 0) {
                            response = lyric;
                        }
                    }).catch((e: any) => {
                        response = `${Messages.LYRIC_NOT_FOUND}, ${e}`
                    });
                    return;
                }
            }, (err) => {
                response = this.handleError(err)
            });

        return response;
    }

    public async getLyric(artist: string | undefined, song: string | undefined) {
        const options = {
            apiKey: authConfig.geniusToken,
            title: song,
            artist: artist,
            optimizeQuery: false
        };

        return await getLyrics(options);
    }

    public async getTrackDetails(trackId: string) {
        const track = await this.spotifyApi.getTrack(trackId);

        return track;
    }


    public handleError(err: Error) {
        if (err.statusCode === 401 && err.name === 'WebapiError' && err.message === 'Unauthorized') {
            // res.redirect(`/login/${req.path.slice(1, req.path.length)}`);
        } else {
            // res.send({ "ERROR": err });
        }
    }

    private setCredentials(user: User) {
        this.spotifyApi.setAccessToken(user.token ? user.token : "");
        this.spotifyApi.setRefreshToken(user.refreshToken ? user.refreshToken : "");
    }
}
