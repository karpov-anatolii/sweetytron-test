import { makeAutoObservable } from "mobx";

export default class OrderStore {
  //Глобальное хранилище. Из любого места можно получить его данные, т.к.он записан в  context, и получить значения можно через хук  useContext()
  constructor() {
    this._order = [];
    this._receiveOrders = [];
    this._cartIsOpen = false;
    makeAutoObservable(this);
  }

  setOrder(device) {
    this._order = [...this._order, device];
    sessionStorage.setItem("order", JSON.stringify(this._order));
  }

  clearOrder() {
    this._order = [];
    sessionStorage.removeItem("order");
  }

  setReceiveOrder(orders) {
    this._receiveOrders = orders;
  }

  setCartIsOpen(bool) {
    this._cartIsOpen = bool;
  }

  deleteOne(id) {
    this._order = this._order.filter((el) => el.id !== id);
    sessionStorage.setItem("order", JSON.stringify(this._order));
  }

  get order() {
    return this._order;
  }

  get receiveOrders() {
    return this._receiveOrders;
  }

  get cartIsOpen() {
    return this._cartIsOpen;
  }
}
