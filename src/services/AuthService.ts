import UserRepository from '../repositories/UserRepository';
import JWTUtil, { ValidateTokenPropos } from '../utils/JWTUtil';


export class AuthService {

    userRepository = new UserRepository();
    jwtUtil = new JWTUtil();

    public async login(_id: string) {
        const user = await this.userRepository.get(_id);
        let token = '';
        return { user, token };
    }

    public async validateToken(data: ValidateTokenPropos) {
       
        const msg = {
            status: this.jwtUtil.validateToken(data)
        };
    
        return (msg);
    }
}