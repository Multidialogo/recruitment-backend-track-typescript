export class HttpError extends Error {
  constructor(public status: number, message: string, public detail?: any) {
    super(message);
    this.name = this.constructor.name;
  }
}
export class NotFoundError extends HttpError {
  constructor(message = "Not Found", detail?: any) { super(404, message, detail); }
}
export class ConflictError extends HttpError {
  constructor(message = "Conflict", detail?: any) { super(409, message, detail); }
}
export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", detail?: any) { super(400, message, detail); }
}
export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", detail?: any) { super(401, message, detail); }
}
export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", detail?: any) { super(403, message, detail); }
}
