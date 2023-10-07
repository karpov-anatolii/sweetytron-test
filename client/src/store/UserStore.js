import { makeAutoObservable } from "mobx";

export default class UserStore {
  //Глобальное хранилище. Из любого места можно получить его данные, т.к.он записан в  context, и получить значения можно через хук  useContext()
  constructor() {
    this._isAuth = false;
    this._user = {};
    makeAutoObservable(this);
  }

  setIsAuth(bool) {
    this._isAuth = bool;
  }

  setUser(user) {
    this._user = user;
  }

  get isAuth() {
    return this._isAuth;
  }

  get user() {
    return this._user;
  }
}
