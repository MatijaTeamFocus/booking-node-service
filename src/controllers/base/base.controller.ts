import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  isErrorReport,
} from "../../constants/error.constants";

import { Response } from "express";
import { ValidationError } from "joi";

export class BaseController {
  protected async handleErrorResponse(
    response: Response,
    error: any
  ): Promise<Response> {
    if (isErrorReport(error)) {
      return response.status(error.statusCode).send(error.body);
    } else if (error.response?.status === 404) {
      return response.status(error.response.status).send(error.response.data);
    } else if (error instanceof ValidationError) {
      return response.status(BAD_REQUEST.statusCode).send({
        message: "Invalid request",
        details: error.details.map((detail) => detail.message),
      });
    }

    return response
      .status(INTERNAL_SERVER_ERROR.statusCode)
      .send(INTERNAL_SERVER_ERROR.body);
  }
}
