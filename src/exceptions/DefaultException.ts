interface ErrorProps {
  status: string;
  status_code: number;
  message: string;
  stack: string;
}

class DefaultException extends Error{

  status: string;
  status_code: number;
  message: string;
  stack: string;

  constructor(err: ErrorProps) {
    super();
    this.status = err.status;
    this.status_code = err.status_code;
    this.message = err.message;
    this.stack = err.stack
  }

  throw_error() {
      throw new DefaultException(this);
  }
  

}

export default DefaultException;