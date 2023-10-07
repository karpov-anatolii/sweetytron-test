import React, { useContext } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { login, registration } from "./../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { Formik, Form, Field } from "formik";

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const click = async (value) => {
    try {
      let data;
      if (isLogin) {
        data = await login(value.email, value.password);
      } else {
        data = await registration(value.email, value.password);
        if (data.role == "ADMIN") alert("Ви  зареєстровані як ADMIN");
      }
      user.setUser(data);
      user.setIsAuth(true);
      navigate(SHOP_ROUTE);
      //console.log("user.user=" + JSON.stringify(user.user));
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  const validateEmail = (value) => {
    if (!value) {
      return "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      return "Неправильний email";
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Required";
    } else if (value.length < 4) {
      return "Мінімум 4 символи";
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: window.innerHeight - 232 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Авторизація" : "Реєстрація"}</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            click(values);
          }}
        >
          {({ errors, touched }) => (
            <Form className="d-flex flex-column">
              <div
                className="d-flex flex-column"
                style={{ position: "relative" }}
              >
                <label className="mt-4">Електронна пошта</label>
                <Field className="mb-3" name="email" validate={validateEmail} />
                {errors.email && touched.email && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      color: "red",
                    }}
                  >
                    {errors.email}
                  </div>
                )}
              </div>
              <div
                className="d-flex flex-column"
                style={{ position: "relative" }}
              >
                <label className="mt-3">Пароль</label>
                <Field
                  className="mb-3 "
                  name="password"
                  type="password"
                  validate={validatePassword}
                />
                {errors.password && touched.password && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      color: "red",
                    }}
                  >
                    {errors.password}
                  </div>
                )}
              </div>
              {/* <button type="submit"> Отправить</button> */}
              <Row className="d-flex flex-row mt-3">
                <Col>
                  {isLogin ? (
                    <>
                      Немає облікового запису?
                      <NavLink to={REGISTRATION_ROUTE}> Зареєструйся!</NavLink>
                    </>
                  ) : (
                    <>
                      Є обліковий запис?
                      <NavLink to={LOGIN_ROUTE}> Увійдіть!</NavLink>
                    </>
                  )}
                </Col>
                <Col xs="auto" className="d-flex justify-content-end  ">
                  <Button
                    type="submit" //при нажатии на type="submit" срабатывает onSubmit в Formik, и проверяет валидность заполненных полей. Если валидность не прошла то он не вызовет ф-цию в onSubmit
                    variant={"outline-success"}
                    className=" "
                  >
                    {isLogin ? "Увійти" : "Реєстрація"}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
});

export default Auth;
