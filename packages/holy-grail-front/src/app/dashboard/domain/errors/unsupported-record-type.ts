export default class UnsupportedRecordTypeError extends Error {
  constructor(type: string) {
    super(`Record type ${type} is not supported by The Holy Grail.`);
  }
}
