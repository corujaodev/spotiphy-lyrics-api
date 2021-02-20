import UserRepository from '../repositories/UserRepository';

import BusinessException from '../exceptions/BusinessException';
import AuthConstants from '../constants/AuthConstants';
import JWTUtil, { ValidateTokenPropos } from '../utils/JWTUtil';


export class AuthService {

    userRepository = new UserRepository();
    jwtUtil = new JWTUtil();

    public async login(email: string, password: string) {
        const user = await this.userRepository.getByEmail(email);
        let token = '';

        if (user) {
            if (!this.jwtUtil.passwordIsValid(password, user.password)) {
                throw new BusinessException(AuthConstants.USER_PASSWOR_INVALID);
            } else {
                token = this.jwtUtil.generateToken(user._id);
            }
        }
        user.password = '';
        return { user, token };
    }

    public async validateToken(data: ValidateTokenPropos) {
        const user = await this.userRepository.getByEmail(data.email);

        const msg = {
            status: this.jwtUtil.validateToken(user.id, data)
        };
    
        return (msg);
    }
}