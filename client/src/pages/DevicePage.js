import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Carousel,
  Col,
  Container,
  Image,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchOneDevice,
  fetchSections,
  fetchCategories,
  delComment,
} from "../http/deviceAPI";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { LOGIN_ROUTE } from "../utils/consts";
import { AiOutlineHome } from "react-icons/ai";
import { BsCartCheckFill } from "react-icons/bs";
import ModalInfo from "../components/modals/ModalInfo";
import CreateComment from "../components/modals/CreateComment";

const DevicePage = observer((props) => {
  const [deviceCurrent, setDeviceCurrent] = useState({
    info: [],
    comments: [],
  });
  const [deviceCurrentImg, setDeviceCurrentImg] = useState([]);
  const { id } = useParams();
  const { order, user, device } = useContext(Context);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [infoText, setInfoText] = useState("");
  const [commentVisible, setCommentVisible] = useState(false);

  let oldPrice = null;
  if (
    deviceCurrent.badge &&
    deviceCurrent.badge !== "null" &&
    deviceCurrent.badge.match(/-\d+%/)
  ) {
    let discount = deviceCurrent.badge.match(/-(\d+)%/)[1];
    oldPrice = parseInt((Number(deviceCurrent.price) * 100) / (100 - discount));
  }

  useEffect(() => {
    let category, section;

    fetchOneDevice(id)
      .then((data) => {
        category = data.categoryId;
        section = data.sectionId;
        setDeviceCurrent(data);
        setDeviceCurrentImg(JSON.parse(data.img));
      })
      .then((data) => fetchCategories())
      .then((data) => {
        device.setCategories(data);

        device.setSelectedCategory(data.filter((el) => el.id == category)[0]);
        return fetchSections(category);
      })
      .then((data) => {
        device.setSections(data);
        device.setSelectedSection(data.filter((el) => el.id == section)[0]);
      })
      .then(() => {
        if (infoText) {
          setShow(true);
          setTimeout(() => {
            setShow(false);
            setInfoText("");
          }, 2000);
        }
      });
  }, [id, infoText]);

  let count = 1;
  return (
    <Container className=" py-3">
      <Breadcrumb>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{
            to: `/`,
          }}
        >
          <AiOutlineHome className="transform-1-4 mb-1" />
        </Breadcrumb.Item>

        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{
            to: `/?category=${device.selectedCategory.id}&section=all`,
          }}
        >
          {device.selectedCategory.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{
            to: `/?category=${device.selectedCategory.id}&section=${device.selectedSection.id}`,
          }}
        >
          {device.selectedSection.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{deviceCurrent.name}</Breadcrumb.Item>
      </Breadcrumb>
      <Row xs="auto" className="ms-3 mt-4 fw-bold fs-2">
        <Col className="me-2">{deviceCurrent.name}</Col>
        <Col className="fw-normal">
          {deviceCurrent.info.filter((el) => el.title === "Вага")[0] &&
            parseInt(
              deviceCurrent.info.filter((el) => el.title === "Вага")[0]
                .description
            ) !== 0 &&
            deviceCurrent.info.filter((el) => el.title === "Вага")[0]
              .description}
        </Col>
      </Row>
      <Row className="ms-3 mb-3  ">Код: {deviceCurrent.id}</Row>
      <Row>
        <Col md={8} className="text-center mb-3">
          <Carousel>
            {deviceCurrentImg.map((file) => (
              <Carousel.Item key={file} className="carousel-device-page">
                <img
                  className="d-block w-100"
                  src={process.env.REACT_APP_API_URL + "images/" + file}
                  alt="First slide"
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        <Col md={4} className="">
          <Card className="d-flex price-card justify-content-center p-3 position-relative ">
            {deviceCurrent.badge !== "null" && (
              <Badge
                pill
                bg={oldPrice ? "danger" : "warning"}
                className="position-absolute m-1 fs-5 top-0 start-0"
              >
                {deviceCurrent.badge}
              </Badge>
            )}
            <div className="fw-bold">
              {oldPrice && (
                <span className="text-danger fw-normal text-decoration-line-through">{`${oldPrice}грн.`}</span>
              )}
            </div>
            <div className="text-center fs-2">
              Цiна: {deviceCurrent.price} грн.
            </div>
            <div
              className={` fw-normal  text-center ${
                deviceCurrent.status !== "Немає в наявності"
                  ? "text-success"
                  : "text-secondary"
              } `}
            >
              {deviceCurrent.status}
            </div>
            {deviceCurrent.status !== "Немає в наявності" && (
              <Button
                className="mx-auto w-75 mt-4"
                variant="outline-dark"
                onClick={() => {
                  if (!user.isAuth) {
                    setShow(true);
                    return;
                  }
                  setInfoText(`Товар ${deviceCurrent.name} успішно доданий!`);
                  order.setOrder(deviceCurrent);
                }}
              >
                Додати до кошику
              </Button>
            )}
          </Card>
        </Col>

        <Col md={6}>
          <Card className="d-flex device-property flex-column m-2">
            <Card.Header className="fw-bolder fs-5 text-center">
              Характеристики
            </Card.Header>
            <ListGroup variant="flush">
              {deviceCurrent.info.map((desc) => (
                <ListGroup.Item
                  className={`${
                    count % 2 === 0 ? "bg-body-tertiary" : "transparent"
                  }`}
                  key={desc.id}
                >
                  {count++}. {desc.title}:{" " + desc.description}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={6}>
          <div className="comment m-2">
            <Card>
              <Card.Header className="text-center fs-5 fw-bold">
                Вiдгуки покупцiв про {deviceCurrent.name}
              </Card.Header>
              <Card.Body className="w-100">
                {deviceCurrent.comments.length == 0 ? (
                  <div className="mb-3">
                    Вiдгукiв поки що нема про цей товар, але Ви можете залишити
                    першим.
                  </div>
                ) : (
                  <span className="text-secondary">
                    Вiдгукiв:{deviceCurrent.comments.length}{" "}
                  </span>
                )}
                <Button
                  className="float-end w-50 "
                  variant="outline-success"
                  onClick={() => {
                    if (!user.isAuth) {
                      setShow(true);
                      return;
                    }
                    setCommentVisible(true);
                  }}
                >
                  Залишити вiдгук
                </Button>
              </Card.Body>
            </Card>
            {deviceCurrent.comments.map((el) => (
              <Card key={el.id} className="my-1">
                <Card.Header className="">
                  {user.isAuth && user.user.role === "ADMIN" && (
                    <div className="w-100 d-inline-block">
                      <Button
                        className="float-end w-50 "
                        variant="outline-danger"
                        onClick={() => {
                          delComment(el.id).then((data) => {
                            setInfoText(
                              `Вiдгук вiд ${el.name}  успiшно видалений!`
                            );
                          });
                        }}
                      >
                        Видалити вiдгук
                      </Button>
                    </div>
                  )}
                  <span className="text-success fs-4 me-2 lh-1">
                    <BsCartCheckFill />
                  </span>
                  <span className="fw-bolder fs-5">{el.name}</span>
                  <span className="float-end text-secondary">
                    {new Date(el.createdAt).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </Card.Header>
                <Card.Body>
                  <div>{el.comment}</div>
                  {el.advantage && (
                    <div>
                      <span className="fw-bold">Переваги:</span> {el.advantage}
                    </div>
                  )}
                  {el.flaw && (
                    <div>
                      <span className="fw-bold">Недоліки:</span> {el.flaw}
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>

      {!user.isAuth && (
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Ви маєте авторизуватися!</Modal.Title>
          </Modal.Header>
          {/* <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body> */}
          <Modal.Footer>
            <Button variant="primary" onClick={() => navigate(LOGIN_ROUTE)}>
              Авторизація
            </Button>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Закрити
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {user.isAuth && (
        <>
          <CreateComment
            show={commentVisible}
            onHide={() => setCommentVisible(false)}
            id={deviceCurrent.id}
            setInfoText={setInfoText}
          />
          <ModalInfo
            info={infoText}
            color="text-success"
            show={show}
            onHide={() => setShow(false)}
          />
        </>
      )}
    </Container>
  );
});

export default DevicePage;
