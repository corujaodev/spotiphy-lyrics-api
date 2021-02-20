import { Request } from 'express';
import AuthConstants from '../constants/AuthConstants';
import UnauthorizedException from '../exceptions/UnauthorizedException';
import jwt from 'jsonwebtoken';

import { authConfig } from '../config/AuthConfig';

export function expressAuthentication(
    request: Request,
    _securityName: string,
    _scopes?: string[]
): Promise<any> {

    const authHeader = request.headers.authorization;
    
    return new Promise((resolve, reject) => {

        if (!authHeader) {
            const error = new UnauthorizedException(AuthConstants.NO_TOKEN_PROVIDED);
            reject(error)
        }

        const parts = authHeader ? authHeader.split(' ') : '';

        if (parts.length !== 2) {
            const error =  new UnauthorizedException(AuthConstants.TOKEN_MALFORMATTED)
            reject(error)
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            const error =  new UnauthorizedException(AuthConstants.TOKEN_MALFORMATTED);
            reject(error)
        }

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) {
                const error =  new UnauthorizedException(AuthConstants.INVALID_TOKEN);
                reject(error);
            }

            resolve(decoded);
        });

    });
}