export class BusinessException extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "BusinessException";
  }
}
