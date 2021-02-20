import HttpStatus from 'http-status-codes';

class BusinessException extends Error {

  status: string;
  status_code: number;

  constructor(message: string) {
    super();
    this.status = HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR);
    this.status_code = HttpStatus.INTERNAL_SERVER_ERROR;
    this.message = message;
  }
}
export default BusinessException;