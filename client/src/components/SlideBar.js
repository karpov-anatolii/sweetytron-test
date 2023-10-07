import React, { useContext, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE, LOGIN_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { FaCartArrowDown } from "react-icons/fa";
import ModalInfo from "./modals/ModalInfo";

const SlideBar = observer(({ devices }) => {
  const { order, user, device } = useContext(Context);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let oldPrice = devices.map((device) => {
    if (device.badge !== "null" && device.badge.match(/-\d+%/)) {
      let discount = device.badge.match(/-(\d+)%/)[1];
      return parseInt((Number(device.price) * 100) / (100 - discount));
    } else return null;
  });
  return (
    <Container>
      <Row className="slide-bar-row my-4">
        {devices.map((device, index) => (
          <Col
            xs={6}
            md={4}
            lg={3}
            xxl={2}
            className="p-2 border border-dark-subtle "
            key={device.id}
          >
            {user.isAuth && user.user.role === "ADMIN" && (
              <Button
                className="mb-2"
                variant={"outline-dark"}
                onClick={() => {
                  navigate(DEVICE_ROUTE + "/" + device.id + "/edit");
                }}
              >
                Редагувати
              </Button>
            )}

            <Card border={"light"}>
              <div className="image-container position-relative">
                <Image
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={
                    process.env.REACT_APP_API_URL +
                    "images/thumbs/" +
                    JSON.parse(device.img)[0]
                  }
                  onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
                />
                {device.badge !== "null" && (
                  <Badge
                    pill
                    bg={oldPrice[index] ? "danger" : "warning"}
                    className="position-absolute m-1 badge fs-5 top-0 start-0"
                  >
                    {device.badge}
                  </Badge>
                )}
              </div>

              <div className=" d-flex mt-2 justify-content-between align-items-center">
                <Row
                  xs="auto"
                  className="d-flex m-0 w-100 justify-content-between"
                >
                  <div className="p-0 me-2 w-100">
                    {device.name}
                    <span className="float-end ms-2">
                      {device.info.filter((el) => el.title === "Вага")[0] &&
                        parseInt(
                          device.info.filter((el) => el.title === "Вага")[0]
                            .description
                        ) !== 0 &&
                        device.info.filter((el) => el.title === "Вага")[0]
                          .description}
                    </span>
                  </div>
                </Row>
              </div>
              <div className="fw-light " style={{ fontSize: "0.8em" }}>
                {" "}
                Код: {device.id}
              </div>

              <Row xs="auto" className="justify-content-between">
                <Col>
                  <div className="fw-bold">
                    {oldPrice[index] && (
                      <span className="text-danger fw-normal text-decoration-line-through">{`${oldPrice[index]}грн.`}</span>
                    )}
                    {device.price}грн.
                  </div>

                  <div
                    className={`float-start fw-normal ${
                      device.status !== "Немає в наявності"
                        ? "text-success"
                        : "text-secondary"
                    } `}
                  >
                    {device.status}
                  </div>
                </Col>
                {device.status !== "Немає в наявності" && (
                  <Col>
                    <FaCartArrowDown
                      className="  shop-cart-button"
                      onClick={() => {
                        if (!user.isAuth) {
                          handleShow();
                          return;
                        }
                        handleShow();
                        setTimeout(() => handleClose(), 2000);
                        order.setOrder(device);
                      }}
                    />
                  </Col>
                )}
              </Row>
            </Card>

            {!user.isAuth && (
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Ви маєте авторизуватися!</Modal.Title>
                </Modal.Header>
                {/* <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body> */}
                <Modal.Footer>
                  <Button
                    variant="primary"
                    onClick={() => navigate(LOGIN_ROUTE)}
                  >
                    Авторизація
                  </Button>
                  <Button variant="secondary" onClick={handleClose}>
                    Закрити
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </Col>
        ))}
      </Row>
      {user.isAuth && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Товар успішно доданий!</Modal.Title>
          </Modal.Header>
        </Modal>
      )}
    </Container>
  );
});

export default SlideBar;
