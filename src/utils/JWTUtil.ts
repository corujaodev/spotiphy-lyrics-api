import UnauthorizedException from '../exceptions/UnauthorizedException';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/AuthConfig';
import AuthConstants from '../constants/AuthConstants';
import bcrypt from 'bcrypt';
import moment from 'moment';

export interface ValidateTokenPropos {
    token: string;
    _id: string;
}

interface DecodedProps {
    id: string;
    iat: number;
    exp: number;
}

class JWTUtil {

    generateToken(_id: string): string {

        return jwt.sign({ id: _id }, authConfig.secret, {
            expiresIn: authConfig.expire_time
        });

    }

    validateToken(data: ValidateTokenPropos) {
        let isValid = null;
        jwt.verify(data.token, authConfig.secret, (err, decoded: any) => {
            if (err) {
                throw new UnauthorizedException(AuthConstants.INVALID_TOKEN);
            }
            if(decoded) {
                const decodedValue: DecodedProps = decoded;
                isValid = {
                    valid: this.compareAndValidateDecodedData(decodedValue.id, decodedValue.exp, data._id),
                    exp: moment.unix(decodedValue.exp)
                }
            }
        });
        return isValid;
    }

    compareAndValidateDecodedData(idDecoded: string, exp: number, idUser: string) {
        const idValid = idDecoded === idUser;
        const isExpired = moment().isAfter(moment.unix(exp));
       
        return idValid && !isExpired;
    }

    async passwordIsValid(password: string, databasePassword: string) {
        return await bcrypt.compare(password, String(databasePassword))
    }

}

export default JWTUtil;