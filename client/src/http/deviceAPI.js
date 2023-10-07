import { $authHost, $host } from ".";
import jwt_decode from "jwt-decode"; // этот модуль нужен для распарсивания токена от ответа сервера, для сохранения информации о клиенте в его страничке пользователя
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";
import DeleteCategory from "../components/modals/EditCategory";

export const createCategory = async (formData) => {
  const { data } = await $authHost.post("api/category", formData);
  return data;
};

export const createSlide = async (formData) => {
  const { data } = await $authHost.post("api/slideshow", formData);
  return data;
};

export const createArticle = async (formData) => {
  const { data } = await $authHost.post("api/article", formData);
  return data;
};

export const createSection = async (formData) => {
  const { data } = await $authHost.post("api/section", formData);
};

export const fetchSlideShow = async () => {
  const { data } = await $host.get("api/slideshow");
  return data;
};

export const fetchArticles = async () => {
  const { data } = await $host.get("api/article");
  return data;
};

export const fetchCategories = async () => {
  const { data } = await $host.get("api/category");
  return data;
};

export const fetchSections = async (id = 1) => {
  const { data } = await $host.get("api/section", {
    params: { categoryId: id },
  });
  return data;
};

export const fetchSectionsAll = async () => {
  const { data } = await $host.get("api/section");
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await $authHost.post("api/category/delete", { id });
  return data;
};

export const editCategory = async (formData) => {
  const { data } = await $authHost.post("api/category/edit", formData);
  return data;
};

export const editSection = async (formData) => {
  const { data } = await $authHost.post("api/section/edit", formData);
  return data;
};

export const deleteSection = async (id) => {
  const { data } = await $authHost.post("api/section/delete", { id });
  return data;
};

export const createDevice = async (device) => {
  const { data } = await $authHost.post("api/device", device);
  return data;
};

export const editDevice = async (formData) => {
  const { data } = await $authHost.post("api/device/edit", formData);
  return data;
};

export const editSlide = async (formData) => {
  const { data } = await $authHost.post("api/slideshow/edit", formData);
  return data;
};

export const editArticle = async (formData) => {
  const { data } = await $authHost.post("api/article/edit", formData);
  return data;
};

export const editInfo = async (formData) => {
  const { data } = await $authHost.post("api/info/edit", formData);
  return data;
};

export const fetchInfo = async () => {
  const { data } = await $host.get("api/info");
  return data;
};

export const deleteSlide = async (id) => {
  const { data } = await $authHost.post("api/slideshow/delete", { id });
  return data;
};

export const deleteArticle = async (id) => {
  const { data } = await $authHost.post("api/article/delete", { id });
  return data;
};

export const deleteDevice = async (id) => {
  const { data } = await $authHost.post("api/device/delete", { id });
  return data;
};

export const fetchDevices = async (categoryId, sectionId, page, limit = 5) => {
  const { data } = await $host.get("api/device", {
    params: { categoryId, sectionId, page, limit },
  });
  return data;
};

export const fetchActionItems = async (page, limit = 10) => {
  const { data } = await $host.get("api/device/actionitems", {
    params: { page, limit },
  });
  return data;
};

export const fetchTopItems = async (page, limit = 10) => {
  const { data } = await $host.get("api/device/topitems", {
    params: { page, limit },
  });
  return data;
};

export const fetchHotItems = async (page, limit = 10) => {
  const { data } = await $host.get("api/device/hotitems", {
    params: { page, limit },
  });
  return data;
};

export const searchDevice = async (word) => {
  const { data } = await $host.get("api/device/search", {
    params: { word },
  });
  return data;
};

export const fetchOneDevice = async (id) => {
  const { data } = await $host.get("api/device/" + id);

  return data;
};

export const createComment = async (name, comment, advantage, flaw, id) => {
  const { data } = await $authHost.post("api/device/comment", {
    name,
    comment,
    advantage,
    flaw,
    id,
  });
  return data;
};

export const delComment = async (id) => {
  const { data } = await $authHost.post("api/device/delcomment", {
    id,
  });
  return data;
};

export const fetchComments = async (commentsDate) => {
  const { data } = await $authHost.post("api/device/comments/all", {
    commentsDate,
  });
  return data;
};
