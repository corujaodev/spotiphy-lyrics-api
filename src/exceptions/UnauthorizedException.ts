import HttpStatus from 'http-status-codes';

class UnauthorizedException extends Error {

  status: string;
  status_code: number;

  constructor(message: string) {
    super();
    this.status = HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED);
    this.status_code = HttpStatus.UNAUTHORIZED;
    this.message = message;
  }
}
export default UnauthorizedException;