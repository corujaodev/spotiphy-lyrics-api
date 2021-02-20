import HttpStatus from 'http-status-codes';

class UpdateFailedException extends Error {

  status: string;
  status_code: number;

  constructor(message: string) {
    super();
    this.status = HttpStatus.getStatusText(HttpStatus.UNPROCESSABLE_ENTITY);
    this.status_code = HttpStatus.UNPROCESSABLE_ENTITY;
    this.message = message;
  }
}
export default UpdateFailedException;