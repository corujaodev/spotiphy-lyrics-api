import HttpStatus from 'http-status-codes';

class ResourceNotFoundException extends Error {

  status: string;
  status_code: number;

  constructor(message: string) {
    super();
    this.status = HttpStatus.getStatusText(HttpStatus.NOT_FOUND);
    this.status_code = HttpStatus.NOT_FOUND;
    this.message = message;
  }
}

export default ResourceNotFoundException;