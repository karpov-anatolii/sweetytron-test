import { makeAutoObservable } from "mobx";

export default class InfoStore {
  //Глобальное хранилище. Из любого места можно получить его данные, т.к.он записан в  context, и получить значения можно через хук  useContext()
  constructor() {
    this._siteName = "";
    this._logo = "";
    this._articles = [];
    this._masterCard = "";
    this._masterPhone = "";
    this._commentDay = 0;
    makeAutoObservable(this);
  }

  setCommentDay(day) {
    this._commentDay = day;
  }

  setSiteName(name) {
    this._siteName = name;
  }

  setLogo(logo) {
    this._logo = logo;
  }

  setArticles(articles) {
    this._articles = articles;
  }

  setMasterCard(num) {
    this._masterCard = num;
  }

  setMasterPhone(num) {
    this._masterPhone = num;
  }

  get siteName() {
    return this._siteName;
  }

  get logo() {
    return this._logo;
  }

  get articles() {
    return this._articles;
  }

  get masterCard() {
    return this._masterCard;
  }

  get masterPhone() {
    return this._masterPhone;
  }

  get commentDay() {
    return this._commentDay;
  }
}
