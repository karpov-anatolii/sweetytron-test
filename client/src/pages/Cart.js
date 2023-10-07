import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { Formik, Form, Field } from "formik";
import { sendOrder } from "../http/orderAPI";
import ModalInfo from "../components/modals/ModalInfo";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";

const Cart = observer(() => {
  const { order, user, info } = useContext(Context);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [sum, setSum] = useState(0);
  const navigate = useNavigate();

  const sumOrder = () => {
    setSum(
      order.order.reduce((accu, item) => accu + item.price * item.quantity, 0)
    );
  };

  useEffect(() => {
    order.order.map((el) => (el.quantity = 1));
    order.setCartIsOpen(true);
    sumOrder();
    return () => {
      order.order.map((el) => (el.quantity = 1));
      order.setCartIsOpen(false);
    };
  }, []);

  const addOrder = (values) => {
    const itemQuan = [];
    order.order.map((el) =>
      itemQuan.push({
        id: el.id,
        quan: el.quantity,
        name: el.name,
        price: el.price,
        img: el.img,
      })
    );
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("surName", values.surName);
    formData.append("phone", values.phone);
    formData.append("city", values.city);
    formData.append("delivery", values.delivery);
    formData.append("department", values.department);
    formData.append("payment", values.payment);
    formData.append("itemQuan", JSON.stringify(itemQuan));
    formData.append("sum", sum);
    formData.append("userId", user.user.id);

    sendOrder(formData)
      .then((data) => {
        handleShow();
        order.clearOrder();
      })
      .catch((e) => console.log(e));
  };

  const validateText = (value) => {
    if (!value) {
      return "Обов'язкове поле!";
    } else if (value.length > 20) {
      return "Не бiльше 20 символiв!";
    }
  };

  const validatePhone = (value) => {
    if (!value) {
      return "Обов'язкове поле!";
    } else if (!/^\+?[0-9]{12}$/i.test(value)) {
      return "Неправильний номер!";
    }
  };

  return (
    <Container className="d-flex flex-column">
      <Row>
        {order.order.length === 0 && (
          <div className="text-center  fs-3 m-4">Товарiв поки що нема.</div>
        )}
        <ListGroup as="ol" numbered>
          {order.order.map((el) => (
            <ListGroup.Item
              as="li"
              key={el.id}
              className="d-flex flex-wrap  align-items-center "
            >
              <Image
                className="m-2"
                width={100}
                height={100}
                src={
                  process.env.REACT_APP_API_URL +
                  "images/thumbs/" +
                  JSON.parse(el.img)[0]
                }
              />
              <div style={{ fontWeight: "bold", margin: "0 20px" }}>
                {el.name + " : "}
                <span className="fw-normal">{el.price + " грн"}</span>
                <br />
                <span className="fw-light">{"Код:" + el.id}</span>
              </div>

              <div className="ms-auto me-4">
                {" "}
                Кiлькiсть
                <input
                  style={{ width: "50px", margin: "5px" }}
                  type="number"
                  id={`quantity-${el.id}`}
                  name={`quantity-${el.id}`}
                  min="1"
                  max="100"
                  placeholder="1"
                  onChange={(e) => {
                    el.quantity = e.target.value;
                    sumOrder();
                  }}
                />
                шт.
              </div>
              <Button
                className="ms-4"
                variant="warning"
                onClick={() => {
                  order.deleteOne(el.id);
                  sumOrder();
                }}
              >
                Видалити
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="m-3 fw-bolder" style={{ fontSize: "1.5em" }}>
          Всього:{sum}грн.
        </div>
      </Row>

      <Row className="mb-3">
        <Formik
          initialValues={{
            name: "",
            surName: "",
            phone: "+38",
            city: "",
            delivery: "Нова пошта",
            department: "",
            payment: "Переказ грошей на карту",
          }}
          onSubmit={(values) => {
            addOrder(values);
          }}
        >
          {({ errors, touched }) => (
            <Form className="d-flex flex-column">
              <div className="d-flex flex-column  position-relative">
                <label className="mt-4">Iм'я</label>
                <Field className="mb-3" name="name" validate={validateText} />
                {errors.name && touched.name && (
                  <div className="position-absolute bottom-0 text-danger ">
                    {errors.name}
                  </div>
                )}
              </div>
              <div className="d-flex flex-column position-relative">
                <label className="mt-3">Прiзвище</label>
                <Field
                  className="mb-3"
                  name="surName"
                  validate={validateText}
                />
                {errors.surName && touched.surName && (
                  <div className="position-absolute bottom-0 text-danger ">
                    {errors.surName}
                  </div>
                )}
              </div>

              <div className="d-flex flex-column position-relative">
                <label className="mt-3">Телефон</label>
                <Field className="mb-3" name="phone" validate={validatePhone} />
                {errors.phone && touched.phone && (
                  <div className="position-absolute bottom-0 text-danger ">
                    {errors.phone}
                  </div>
                )}
              </div>

              <div className="d-flex flex-column position-relative">
                <label className="mt-3">Мiсто</label>
                <Field className="mb-3" name="city" validate={validateText} />
                {errors.city && touched.city && (
                  <div className="position-absolute bottom-0 text-danger ">
                    {errors.city}
                  </div>
                )}
              </div>

              <div className="d-flex flex-column position-relative">
                <div className="mt-3">Виберіть варіант доставки </div>
                <div role="group" aria-labelledby="my-radio-group">
                  <label>
                    <Field
                      type="radio"
                      name="delivery"
                      value="Нова пошта"
                      className="ms-4 me-1"
                    />
                    Нова пошта
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="delivery"
                      value="Укрпошта"
                      className="ms-4 me-1"
                    />
                    Укрпошта
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="delivery"
                      value="Мiст Експрес"
                      className="ms-4 me-1"
                    />
                    Мiст Експрес
                  </label>
                </div>
              </div>

              <div className="d-flex flex-column position-relative">
                <label className="mt-3">Вiддiлення</label>
                <Field
                  className="mb-3"
                  name="department"
                  validate={validateText}
                />
                {errors.department && touched.department && (
                  <div className="position-absolute bottom-0 text-danger ">
                    {errors.department}
                  </div>
                )}
              </div>

              <div className="d-flex flex-column position-relative">
                <div className="mt-3">Виберіть варіант оплати </div>
                <div role="group" aria-labelledby="my-radio-group">
                  <label>
                    <Field
                      type="radio"
                      name="payment"
                      disabled={true}
                      value="Накладений платіж"
                      className="ms-4 me-1"
                    />
                    Накладений платіж
                  </label>
                  <br />
                  <label>
                    <Field
                      type="radio"
                      name="payment"
                      value="Переказ грошей на карту"
                      className="ms-4 me-1"
                    />
                    Переказ грошей на карту ( {info.masterCard} )
                  </label>
                </div>
              </div>

              <Button
                variant="warning"
                type="submit"
                className="w-50 mx-auto my-5"
              >
                {" "}
                Вiдправити замовлення
              </Button>
            </Form>
          )}
        </Formik>
      </Row>
      <ModalInfo
        info={`Ваше замовлення вiдправлено! \n  Ми зв'яжемося з Вами найближчим часом`}
        show={show}
        onHide={handleClose}
      />
    </Container>
  );
});

export default Cart;
