import express, { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "../build/routes";
import cors from 'cors';
import DefaultServerErrorException from "./exceptions/DefaultServerErrorException";
import BusinessException from "./exceptions/BusinessException";
import DefaultException from "./exceptions/DefaultException";
import MulterErrorException from "./exceptions/MulterErrorException";
import RegistrationFailedException from "./exceptions/RegistrationFailedException";
import UnauthorizedException from "./exceptions/UnauthorizedException";
import swaggerDocument from '../build/swagger.json';
import UpdateFailedException from "./exceptions/UpdateFailedException";
import logger from './utils/Logger';

export const app = express();

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const options = {
  swaggerOptions: {
    authAction :{ JWT: {name: "JWT", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <JWT>"} },
    withCredentials: true
  }
};

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));


RegisterRoutes(app);

app.use((_req: any, res: ExResponse) => {
  res.status(404).send({
    message: "Not Found",
  });
});

app.use(function errorHandler(
  err: unknown,
  _req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof DefaultServerErrorException ||
      err instanceof BusinessException           ||
      err instanceof DefaultException            ||
      err instanceof MulterErrorException        ||
      err instanceof RegistrationFailedException ||
      err instanceof UnauthorizedException       ||
      err instanceof UpdateFailedException) {

      const error = {
        name: err.name,
        status: err.message,
        status_code: err.status_code,
        message: err.message,
        stack: err.stack
      };

      logger.info(error);
    return res.status(err.status_code).json(error);
  }
  next();
});