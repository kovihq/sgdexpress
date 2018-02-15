export default class DetranError extends Error {
  constructor(message, status, name = 'DETRAN_ERROR') {
    super(message);
    this.name = name;
    this.status = status;
  }
}
