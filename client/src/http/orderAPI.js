import { $authHost, $host } from ".";
import jwt_decode from "jwt-decode"; // этот модуль нужен для распарсивания токена от ответа сервера, для сохранения информации о клиенте в его страничке пользователя
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";

export const sendOrder = async (order) => {
  const { data } = await $authHost.post("api/order", order);
  return data;
};

export const fetchOrders = async () => {
  const { data } = await $authHost.get("api/order");
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await $authHost.post("api/order/delete", { id });
  return data;
};
