import { Request, Response } from 'express';
import UploadUtil, { UploadUtilProperties } from '../utils/UploadUtil';
import UserRepository from '../repositories/UserRepository';
import GeneratorUtil from '../utils/GeneratorUtil';

export class UserService {

    userRepository = new UserRepository();
    generatorUtil = new GeneratorUtil();

    public get(_id: string) {
        try {
            return this.userRepository.get(_id);
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
            user.password = this.generatorUtil.generateRandomPassWord();
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

    public uploadPictureProfile(request: Request, response: Response, next: any) {
        const uploadUtilProperties: UploadUtilProperties = {
            destinationFolder: 'uploads/profile_pictures/',
            fileName: 'profile'
        }

        const uploadUtil = new UploadUtil(uploadUtilProperties);
        try {
            uploadUtil.upload(request, response, next);
        } catch (err) {
            next(err);
        }
    }
}
