import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  createArticle,
  createCategory,
  createSlide,
  fetchCategories,
} from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ModalInfo from "./ModalInfo";

const CreateArticle = observer(({ show, onHide }) => {
  const [name, setName] = useState("Article1");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [visible, setVisible] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [show_menu, setShow_menu] = useState(true);
  const [show_footer, setShow_footer] = useState(true);
  const [show_main, setShow_main] = useState(true);

  const addArticle = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("show_menu", show_menu);
    formData.append("show_footer", show_footer);
    formData.append("show_main", show_main);
    createArticle(formData).then((data) => {
      onHide();
      setShowInfo(true);
      setTimeout(() => setShowInfo(false), 2000);
    });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Додати Статтю
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mt-4 w-25 d-inline-block ">Назва статтi</div>
            <Form.Control
              className="my-3 d-inline-block w-75"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={"Menu1"}
            />

            <div className="mt-4 w-25 d-inline-block ">Заголовок</div>
            <Form.Control
              className="my-3 d-inline-block w-75"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={"Введіть заголовок"}
            />
            <div className="mt-4 w-25 d-inline-block ">Контент статтi</div>
            <Form.Control
              className="my-3 d-inline-block w-75"
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"Введіть контент статтi"}
            />

            <div className="mt-4 w-75 d-inline-block ">
              Виберiть, чи буде показана стаття у меню
            </div>
            <Form.Check
              checked={show_menu}
              className="my-3 d-inline-block w-25"
              type="switch"
              label="Вкл/викл"
              onChange={() => setShow_menu(!show_menu)}
            />

            <div className="mt-4 w-75 d-inline-block ">
              Виберiть, чи буде показана стаття у футерi
            </div>
            <Form.Check
              checked={show_footer}
              className="my-3 d-inline-block w-25"
              type="switch"
              label="Вкл/викл"
              onChange={() => setShow_footer(!show_footer)}
            />

            <div className="mt-4 w-75 d-inline-block ">
              Виберiть, чи буде показана стаття у центрi на головнiй страницi
            </div>
            <Form.Check
              checked={show_main}
              className="my-3 d-inline-block w-25"
              type="switch"
              label="Вкл/викл"
              onChange={() => setShow_main(!show_main)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Закрити
          </Button>
          <Button variant="outline-success" onClick={addArticle}>
            Додати
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalInfo
        info={`Стаття успішно додана! `}
        color="text-success"
        show={showInfo}
      />
    </>
  );
});

export default CreateArticle;
