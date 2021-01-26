export default class Observer {
  constructor() {
    this._observers = [];
    this.loading = false;
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((existedObserver) => existedObserver !== observer);
  }

  isLoading() {
    return this.loading;
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}
