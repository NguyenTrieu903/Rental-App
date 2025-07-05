import { Response } from "express";

interface ResponsePayload<T = unknown> {
  message: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): void => {
  const response: ResponsePayload<T> = { message };

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

export const httpResponses = {
  notFound: (res: Response, message: string) => sendResponse(res, 404, message),

  badRequest: (res: Response, message: string) =>
    sendResponse(res, 400, message),

  serverError: (res: Response, message: string) =>
    sendResponse(res, 500, message),

  success: (res: Response, data: any) =>
    sendResponse(res, 200, "Success", data),

  created: (res: Response, data: any) =>
    sendResponse(res, 201, "Created", data),
};
