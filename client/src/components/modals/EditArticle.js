import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import {
  deleteArticle,
  deleteSlide,
  editArticle,
  editSlide,
  fetchArticles,
  fetchCategories,
  fetchSlideShow,
} from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ModalInfo from "./ModalInfo";

const EditArticle = observer(({ show, onHide }) => {
  const [name, setName] = useState([]);
  const [title, setTitle] = useState([]);
  const [content, setContent] = useState([]);
  const [show_menu, setShow_menu] = useState([]);
  const [show_footer, setShow_footer] = useState([]);
  const [show_main, setShow_main] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  const [articlesData, setArticlesData] = useState([]);

  useEffect(() => {
    fetchArticles().then((data) => {
      setArticlesData(data);
      setName(data.map((el) => el.name));
      setTitle(data.map((el) => el.title));
      setContent(data.map((el) => el.content));
      setShow_menu(data.map((el) => el.show_menu));
      setShow_footer(data.map((el) => el.show_footer));
      setShow_main(data.map((el) => el.show_main));
    });
  }, []);

  const sendArticle = (index, id) => {
    const formData = new FormData();
    formData.append("name", name[index]);
    formData.append("title", title[index]);
    formData.append("content", content[index]);
    formData.append("show_menu", show_menu[index]);
    formData.append("show_footer", show_footer[index]);
    formData.append("show_main", show_main[index]);
    formData.append("id", id);
    editArticle(formData).then((data) => {
      setShowInfo(true);
      setTimeout(() => setShowInfo(false), 2000);
    });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Редагувати Статтi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {articlesData.map((article, index) => (
              <div className="border rounded-2 p-3" key={index}>
                <div className="mt-4 w-100 text-center ">
                  Стаття {article.name}
                </div>

                <span className="mt-4  w-25 d-inline-block  ">Заголовок</span>
                <Form.Control
                  className="my-3  w-75 d-inline-block"
                  value={title[index]}
                  onChange={(e) =>
                    setTitle(
                      title.map((el, i) => (index == i ? e.target.value : el))
                    )
                  }
                  placeholder={article.title}
                />

                <div className="mt-4 w-25 d-inline-block ">Контент статтi</div>
                <Form.Control
                  className="my-3 d-inline-block w-75"
                  value={content[index]}
                  as="textarea"
                  onChange={(e) =>
                    setContent(
                      content.map((el, i) => (index == i ? e.target.value : el))
                    )
                  }
                  placeholder={article.content}
                />

                <div className="mt-4 w-75 d-inline-block ">
                  Виберiть, чи буде показана стаття у меню
                </div>
                <Form.Check
                  className="my-3 d-inline-block w-25"
                  checked={show_menu[index]}
                  type="switch"
                  label="Вкл/викл"
                  onChange={() =>
                    setShow_menu(
                      show_menu.map((el, i) => (index == i ? !el : el))
                    )
                  }
                />

                <div className="mt-4 w-75 d-inline-block ">
                  Виберiть, чи буде показана стаття у футерi
                </div>
                <Form.Check
                  className="my-3 d-inline-block w-25"
                  checked={show_footer[index]}
                  type="switch"
                  label="Вкл/викл"
                  onChange={() =>
                    setShow_footer(
                      show_footer.map((el, i) => (index == i ? !el : el))
                    )
                  }
                />

                <div className="mt-4 w-75 d-inline-block ">
                  Виберiть, чи буде показана стаття у центрi на головнiй
                  страницi
                </div>
                <Form.Check
                  className="my-3 d-inline-block w-25"
                  checked={show_main[index]}
                  type="switch"
                  label="Вкл/викл"
                  onChange={() =>
                    setShow_main(
                      show_main.map((el, i) => (index == i ? !el : el))
                    )
                  }
                />

                <Button
                  className=" d-inline-block w-25 m-5"
                  variant="warning"
                  onClick={() => sendArticle(index, article.id)}
                >
                  Змiнити
                </Button>
                <Button
                  className=" d-inline-block w-25 m-5"
                  variant="danger"
                  onClick={() => {
                    deleteArticle(article.id).then(() => {
                      setShowInfo(true);
                      setTimeout(() => setShowInfo(false), 2000);
                    });
                  }}
                >
                  Видалити
                </Button>
              </div>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Закрити
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalInfo
        info={`Стаття успішно змiнена! `}
        color="text-success"
        show={showInfo}
      />
    </>
  );
});

export default EditArticle;
