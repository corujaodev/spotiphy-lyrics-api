import { Request, Response } from 'express';
import multer from 'multer';

import MulterErrorException from '../exceptions/MulterErrorException';
import DefaultServerErrorException from '../exceptions/DefaultServerErrorException';

import UserController from '../constants/UserController';

export interface UploadUtilProperties {
    destinationFolder: string;
    fileName: string;
}

class UploadUtil {

    properties: UploadUtilProperties;

    constructor(properties: UploadUtilProperties) {
        this.properties = properties;
    }

    getStorage(fileName: string) {
        return multer.diskStorage({
            destination: (_request: any, _file: any, cb: (arg0: null, arg1: string) => void) => {
                cb(null, this.properties.destinationFolder)
            },
            filename: function (_request: any, file: { originalname: string; mimetype: string; }, cb: (arg0: null, arg1: string) => void) {
                cb(null, `${fileName}-${Date.now()}.${file.mimetype.split('/')[1]}`);
            }
        });
    }

    async upload(request: Request, response: Response, next: any) {
        const upload = multer({ storage: this.getStorage(this.properties.fileName) }).single('file')

        try {
            upload(request, response, (err: any) => {
                if (err instanceof multer.MulterError) {
                    throw new MulterErrorException(UserController.MULTER_ERR_500);
                } else if (err) {
                    throw new DefaultServerErrorException(UserController.DEFAULT_ERR_500);
                } else {
                    
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default UploadUtil;