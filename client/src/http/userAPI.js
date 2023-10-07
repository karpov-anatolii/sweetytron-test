import { $authHost, $host } from ".";
import jwt_decode from "jwt-decode"; // этот модуль нужен для распарсивания токена от ответа сервера, для сохранения информации о клиенте в его страничке пользователя

export const registration = async (email, password) => {
  const { data } = await $host.post("api/user/registration", {
    email,
    password,
    role: "USER",
  });
  sessionStorage.setItem("token", data.token); //Сохраняем токен из ответа сервера на post передачу данных юзера
  return jwt_decode(data.token);
};

export const login = async (email, password) => {
  const { data } = await $host.post("api/user/login", { email, password });
  sessionStorage.setItem("token", data.token);

  return jwt_decode(data.token);
};
//После логирования юзера сохраняется токен, при каждом обновлении страницы будет вызываться ф-ция check и если токен не валидный то юзер будет разлогиниваться.Если валидный, то юзер попадает на страницу магазина под  своим аккаунтом
export const check = async () => {
  const data = await $authHost.get("api/user/auth"); //при запросе к серверу будем прикреплять сохраненный токен из локалсторидж
  if (!data.data.token) return;
  sessionStorage.setItem("token", data.data.token); // перезаписываем токен из ответа сервера
  return jwt_decode(data.data.token); //Возвращаем данные о пользователе
};
