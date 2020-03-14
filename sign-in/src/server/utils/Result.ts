export class Result {
  private _isSuccess: boolean;
  private _isFailure: boolean;
  private _errMsg: string;
  private _value: any;
  get isSuccess() {
    return this._isSuccess;
  }
  get isFailure() {
    return this._isFailure;
  }
  get errMsg() {
    if (this.isSuccess) {
      throw new Error("Cannot get an error message from an ok result");
    }
    return this._errMsg;
  }
  get value() {
    if (this.isFailure) {
      throw new Error("Cannot get an value from a failed result");
    }
    return this._value;
  }
  private constructor({
    isSuccess,
    errMsg,
    value
  }: {
    isSuccess: boolean;
    errMsg?: string;
    value?: any;
  }) {
    this._isSuccess = isSuccess;
    this._isFailure = !isSuccess;
    this._errMsg = errMsg ?? "";
    this._value = value ?? "";
  }
  static ok(value?: any) {
    return new Result({ isSuccess: true, value });
  }
  static fail(errMsg: string) {
    return new Result({ isSuccess: false, errMsg });
  }
}
