export class DomainError extends Error {
  readonly code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION');
  }
}
export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT');
  }
}
export class ForbiddenError extends DomainError {
  constructor(message: string) {
    super(message, 'FORBIDDEN');
  }
}
export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
  }
}
export class UnauthenticatedError extends DomainError {
  constructor(message: string) {
    super(message, 'UNAUTHENTICATED');
  }
}
