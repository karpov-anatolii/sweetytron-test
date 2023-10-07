import axios from "axios";

//Создадим 2 инстанса

//Этот для обычных запросов, которые не требуют авторизации
const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// К этому инстансу автоматически будет подставлятся Header.Authorisation (с добавленым токеным) к каждому запросу
const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

//Это ф-ция принимает в параметр config и подставляет к каждому запросу токен из локального хранилища в headers.authorization. При авторизации мы будем добавлять токен в лок. хранилище
const authInterceptor = (config) => {
  config.headers.authorization = `Bearer ${sessionStorage.getItem("token")}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
