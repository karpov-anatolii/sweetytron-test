import { makeAutoObservable } from "mobx";

export default class DeviceStore {
  //Глобальное хранилище. Из любого места можно получить его данные, т.к.он записан в  context, и получить значения можно через хук  useContext()
  constructor() {
    this._categories = [];
    this._sections = [];
    this._devices = [];
    this._selectedCategory = {};
    this._selectedSection = {};
    this._page = 1;
    this._totalCount = 0;
    this._limit = 12;

    makeAutoObservable(this);
  }

  setPage(page) {
    this._page = page;
  }

  setTotalCount(count) {
    this._totalCount = count;
  }

  setSelectedCategory(category) {
    this.setPage(1);
    this._selectedCategory = category;
  }

  setSelectedSection(section) {
    this.setPage(1);
    this._selectedSection = section;
  }

  setCategories(categories) {
    this._categories = categories;
  }

  setSections(sections) {
    this._sections = sections;
  }

  setDevices(devices) {
    this._devices = devices;
  }

  get categories() {
    return this._categories;
  }

  get sections() {
    return this._sections;
  }

  get devices() {
    return this._devices;
  }

  get selectedCategory() {
    return this._selectedCategory;
  }

  get selectedSection() {
    return this._selectedSection;
  }

  get totalCount() {
    return this._totalCount;
  }

  get page() {
    return this._page;
  }

  get limit() {
    return this._limit;
  }
}
