import UserRepository from '../repositories/UserRepository';

export class UserService {

    userRepository = new UserRepository();

    public get(_id: string) {
        try {
            return this.userRepository.get(_id);
        } catch (err) {
            throw err;
        }
    }

    public getByState(state: string) {
        try {
            return this.userRepository.getByState(state);
        } catch (err) {
            throw err;
        }
    }

    public delete(_id: string) {
        try {
            return this.userRepository.delete(_id);
        } catch (err) {
            throw err;
        }
    }

    public getAll() {
        try {
            return this.userRepository.getAll();
        } catch (err) {
            throw err;
        }
    }

    public getBlocked() {
        try {
            return this.userRepository.getBlocked();
        } catch (err) {
            throw err;
        }
    }

    public create(user: any) {
        try {
            return this.userRepository.create(user);
        } catch (err) {
            throw err;
        }
    }

    public update(user: any) {
        try {
            return this.userRepository.update(user);
        } catch (err) {
            throw err;
        }
    }
}
