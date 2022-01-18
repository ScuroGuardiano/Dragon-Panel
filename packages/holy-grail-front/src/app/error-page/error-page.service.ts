import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorPageService extends EventEmitter {

  constructor() {
    super();
  }

  private _error?: any;

  getError() {
    return this._error;
  }

  setError(error: any) {
    this._error = error;
    this.emit(error);
  }

  cleanError() {
    this._error = null;
  }
}
