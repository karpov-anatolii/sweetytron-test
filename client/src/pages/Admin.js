import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import CreateCategory from "../components/modals/CreateCategory";
import CreateSection from "../components/modals/CreateSection";
import EditSection from "../components/modals/EditSection";
import EditCategory from "../components/modals/EditCategory";
import CreateDevice from "../components/modals/CreateDevice";
import CreateSlide from "../components/modals/CreateSlide";
import EditSlideShow from "../components/modals/EditSlideShow";
import CreateArticle from "../components/modals/CreateArticle";
import EditArticle from "../components/modals/EditArticle";
import ModalInfo from "../components/modals/ModalInfo";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { delComment, editInfo, fetchComments } from "../http/deviceAPI";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";
import { BsCartCheckFill } from "react-icons/bs";

const Admin = observer(() => {
  const { info, user } = useContext(Context);
  const [deviceVisible, setDeviceVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [delCategoryVisible, setDelCategoryVisible] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [delSectionVisible, setDelSectionVisible] = useState(false);
  const [slideVisible, setSlideVisible] = useState(false);
  const [editSlideShowVisible, setEditSlideShowVisible] = useState(false);
  const [articleVisible, setArticleVisible] = useState(false);
  const [editArticleVisible, setEditArticleVisible] = useState(false);
  const [logo, setLogo] = useState(info.logo);
  const [siteName, setSiteName] = useState(info.siteName);
  const [masterCard, setMasterCard] = useState(info.masterCard);
  const [masterPhone, setMasterPhone] = useState(info.masterPhone);
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState([]);
  const comObjDate = new Date();
  const [commentsDate, setCommentsDate] = useState("");
  const [infoText, setInfoText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    comObjDate.setDate(comObjDate.getDate() + info.commentDay);
    let date = new Date(comObjDate);
    setCommentsDate(
      date.getDate() +
        "/" +
        (parseInt(date.getMonth()) + 1) +
        "/" +
        date.getFullYear()
    );
    fetchComments(comObjDate).then((data) => {
      setComments(data);
    });
  }, [info.commentDay]);

  const deleteComment = (el) => {
    delComment(el.id).then((data) => {
      fetchComments(comObjDate).then((data) => {
        setComments(data);
        setInfoText(`Вiдгук вiд ${el.name}  успiшно видалений!`);
        setShow(true);
        setTimeout(() => setShow(false), 2000);
      });
    });
  };

  const selectFile = (e) => {
    setLogo(e.target.files[0]);
  };

  const changeInfo = () => {
    const formData = new FormData();
    formData.append("siteName", siteName);
    formData.append("logo", logo);
    formData.append("masterCard", masterCard);
    formData.append("masterPhone", masterPhone);

    editInfo(formData).then((data) => {
      setInfoText("Info успішно змiнена!");
      setShow(true);
      setTimeout(() => setShow(false), 2000);
    });
  };

  return (
    <Container
      style={{ minHeight: window.innerHeight - 232 }}
      className="d-flex admin-page flex-column"
    >
      <div>
        <Button
          variant="outline-dark"
          className="mt-2 w-50"
          onClick={() => setCategoryVisible(true)}
        >
          Додати категорiю
        </Button>
        <Button
          variant="outline-dark"
          className="mt-2 w-50"
          onClick={() => setDelCategoryVisible(true)}
        >
          Редагувати категорiю
        </Button>
      </div>

      <div>
        <Button
          variant="outline-dark"
          className="mt-2 w-50"
          onClick={() => setSectionVisible(true)}
        >
          Додати роздiл до категорії
        </Button>
        <Button
          variant="outline-dark"
          className="mt-2 w-50"
          onClick={() => setDelSectionVisible(true)}
        >
          Редагувати роздiл в категорії
        </Button>
      </div>
      <div>
        <Button
          variant="outline-dark"
          className="mt-2 w-100"
          onClick={() => setDeviceVisible(true)}
        >
          Додати товар
        </Button>
      </div>
      <div>
        <Button
          variant="outline-dark"
          className="mt-2 w-50"
          onClick={() => setSlideVisible(true)}
        >
          Додати Slide
        </Button>
        <Button
          variant="outline-dark"
          className="mt-2 w-50"
          onClick={() => setEditSlideShowVisible(true)}
        >
          Редагувати SlideShow
        </Button>
      </div>

      <div>
        <Button
          variant="outline-dark"
          className="mt-2 w-50"
          onClick={() => setArticleVisible(true)}
        >
          Додати Статтю
        </Button>
        <Button
          variant="outline-dark"
          className="mt-2 w-50"
          onClick={() => setEditArticleVisible(true)}
        >
          Редагувати Статтю
        </Button>
      </div>
      <Card className="my-5 admin-comments">
        <Card.Header>
          <Row>
            <Col className="admin-comments-header ">
              {comments.length} вiдгукiв за:
            </Col>
            <Col className="admin-comments-header ">
              <Button
                variant="outline-dark"
                className="m-2 h-25"
                style={{ minHeight: "30px", paddingTop: "0" }}
                onClick={() => {
                  info.setCommentDay(info.commentDay - 1);
                }}
              >
                -
              </Button>
              <span>{commentsDate}</span>
              <Button
                variant="outline-dark"
                className="m-2 h-25"
                style={{ minHeight: "30px", paddingTop: "0" }}
                onClick={() => {
                  if (info.commentDay >= 0) return;
                  info.setCommentDay(info.commentDay + 1);
                }}
              >
                +
              </Button>
            </Col>
          </Row>
        </Card.Header>
        {comments.map((el) => (
          <Card key={el.id} className="my-2">
            <Card.Header className="">
              <Row className="fs-5 mx-1">{el.device.name}</Row>
              <Row className="mb-3">
                <Col className="d-flex justify-content-center align-items-center">
                  <Image
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "contain",
                    }}
                    src={
                      process.env.REACT_APP_API_URL +
                      "images/thumbs/" +
                      JSON.parse(el.device.img)[0]
                    }
                  />
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                  <Button
                    className="h-auto"
                    variant="outline-danger"
                    onClick={() => deleteComment(el)}
                  >
                    Видалити вiдгук
                  </Button>
                </Col>
              </Row>
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
      </Card>
      <div className="admin-info  p-2 my-5">
        <div className="text-center fs-5 fw-bold">INFO</div>
        <Form>
          <div className="mt-4 w-25 d-inline-block ">Назва сайту</div>
          <Form.Control
            className="my-3 d-inline-block w-75"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder={"Введіть назву сайту"}
          />
          <div className="mt-4 w-25 d-inline-block ">Виберiть лого сайту</div>
          <Form.Control
            className="my-3 d-inline-block w-75"
            type="file"
            onChange={selectFile}
          />
          <div className="mt-4 w-25 d-inline-block ">
            Банк, номер картки, П.I.Б
          </div>
          <Form.Control
            className="my-3 d-inline-block w-75"
            value={masterCard}
            onChange={(e) => setMasterCard(e.target.value)}
            placeholder={"Введіть банк, номер картки, П.I.Б"}
          />
          <div className="mt-4 w-25 d-inline-block ">Телефон сайту</div>
          <Form.Control
            className="my-3 d-inline-block w-75"
            value={masterPhone}
            onChange={(e) => setMasterPhone(e.target.value)}
            placeholder={"Введіть телефон сайту"}
          />
        </Form>
        <div>
          <Button
            className="mt-2 w-50"
            variant="outline-dark"
            onClick={() => navigate(SHOP_ROUTE)}
          >
            Вийти
          </Button>
          <Button
            className="mt-2 w-50"
            variant="outline-dark"
            onClick={changeInfo}
          >
            Змiнити INFO
          </Button>
        </div>
      </div>
      <CreateDevice
        show={deviceVisible}
        onHide={() => setDeviceVisible(false)}
      />
      <CreateCategory
        show={categoryVisible}
        onHide={() => setCategoryVisible(false)}
      />
      <EditCategory
        show={delCategoryVisible}
        onHide={() => setDelCategoryVisible(false)}
      />
      <CreateSection
        show={sectionVisible}
        onHide={() => setSectionVisible(false)}
      />
      <EditSection
        show={delSectionVisible}
        onHide={() => setDelSectionVisible(false)}
      />
      <CreateSlide show={slideVisible} onHide={() => setSlideVisible(false)} />
      <EditSlideShow
        show={editSlideShowVisible}
        onHide={() => setEditSlideShowVisible(false)}
      />
      <CreateArticle
        show={articleVisible}
        onHide={() => setArticleVisible(false)}
      />
      <EditArticle
        show={editArticleVisible}
        onHide={() => setEditArticleVisible(false)}
      />
      <ModalInfo
        info={infoText}
        color="text-success"
        show={show}
        onHide={() => setShow(false)}
      />
      {/* <ModalInfo
        info={`Info успішно змiнена! `}
        color="text-success"
        show={showInfo}
      /> */}
    </Container>
  );
});

export default Admin;
