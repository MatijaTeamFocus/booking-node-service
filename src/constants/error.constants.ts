export class ErrorReport {
    public name: string;
  
    constructor(
      public statusCode: number,
      public message: string,
      public details?: any[]
    ) {
      this.name = this.constructor.name;
    }
  
    public get body(): any {
      return { message: this.message, details: this.details };
    }
  
    public withDetails(details: any[]): ErrorReport {
      return new ErrorReport(this.statusCode, this.message, details);
    }
  
    public withMessage(message: string): ErrorReport {
      return new ErrorReport(this.statusCode, message);
    }
  }
  
  export const OK = new ErrorReport(200, "OK");
  export const CREATED = new ErrorReport(201, "Created");
  export const ACCEPTED = new ErrorReport(202, "Accepted");
  export const NO_CONTENT = new ErrorReport(204, "No Content");
  export const INTERNAL_SERVER_ERROR = new ErrorReport(500, "Internal server error");
  export const BAD_REQUEST = new ErrorReport(400, "Bad request.");
  export const FORBIDDEN = new ErrorReport(403, "Forbidden.");
  export const NOT_FOUND = new ErrorReport(404, "Resource not found.");
  export const FAILED_TO_AUTHENTICATE = new ErrorReport(500, "Auth Service failed to authenticate.");
  
  export const NOT_FOUND_MESSAGE = "Not found.";
  
  export function isErrorReport(error: any): boolean {
    return error instanceof ErrorReport;
  }