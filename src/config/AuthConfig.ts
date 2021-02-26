require('dotenv').config({  
    path: process.env.NODE_ENV === "development" ? ".env.dev" : ".env"
});

export const authConfig = {
    secret: "3832F73B-4FD9-4C29-8061-24F6DD43FA96",
    expire_time: 86400,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
    spotifyUrlAuthorize: process.env.SPOTIFY_URL_AUTHORIZE,
    spotifyUrltoken: process.env.SPOTIFY_URL_TOKEN,
    spotifyScope: process.env.SPOTIFY_SCOPE,
    geniusId: process.env.GENIUS_ID,
    geniusSecret: process.env.GENIUS_SECRET,
    geniusToken: process.env.GENIUS_TOKEN
};
