import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";
import Footer from "./components/Footer";
import { fetchArticles, fetchInfo } from "./http/deviceAPI";
import ScrollToTop from "./scrollToTop";

const App = observer(() => {
  const { user, info } = useContext(Context);
  const [loading, setLoading] = useState(true); //Локальное состояние, кот. отвечает за то- идет загрузка страницы или нет.По дефолту true, добавляем на стр. крутилку, затем отправляется на сервер запрос проверки юзера, и когда вернулся ответ-делаем это состояние false, и страница загружается
  //Этот запрос нужно отправлять только 1 раз при открытии приложения. Для этого исп. useEffect с пустым []
  useEffect(() => {
    check()
      .then((data) => {
        if (data) {
          user.setUser(data);
          user.setIsAuth(true);
        }
      })
      .catch((er) => console.log("NO USER"))
      .finally(() => setLoading(false));

    fetchArticles()
      .then((data) => info.setArticles(data))
      .catch((err) => console.log(err));

    fetchInfo()
      .then((data) => {
        info.setSiteName(data.filter((el) => el.key == "siteName")[0].value);
        info.setLogo(data.filter((el) => el.key == "logo")[0].value);
        info.setMasterCard(
          data.filter((el) => el.key == "masterCard")[0].value
        );
        info.setMasterPhone(
          data.filter((el) => el.key == "masterPhone")[0].value
        );
      })
      .catch((err) => console.log(err));
  }, []);

  if (loading) {
    return (
      <div className="d-flex vh-100  justify-content-center align-items-center">
        <Spinner animation={"border"} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <NavBar />
      <AppRouter />
      <Footer />
    </BrowserRouter>
  );
});

export default App;
