export default class BadCredentialsError extends Error {
  constructor() {
    super("Username or password is incorrect.");
    this.name = BadCredentialsError.name;
  }
}
