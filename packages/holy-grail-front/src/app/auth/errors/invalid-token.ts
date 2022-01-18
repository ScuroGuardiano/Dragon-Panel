export class InvalidTokenError extends Error {
  constructor() {
    super("JWT token is invalid!");
    this.name = InvalidTokenError.name;
  }
}
