import { ValidationError } from "express-validator";

export interface IDefaultMessageResponse {
  message: string;
}

export interface IErrorModelMessageResponse {
  message: string;
  errors: Array<ValidationError>;
}

export const NotFoundResponse: IDefaultMessageResponse = {
  message: "NotFound.",
};

export const UnauthorizedResponse: IDefaultMessageResponse = {
  message: "Unauthorized.",
};

export const ForbiddenResponse: IDefaultMessageResponse = {
  message: "AccessDenied.",
};
