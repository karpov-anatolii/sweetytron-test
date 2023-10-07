import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  createCategory,
  createSlide,
  fetchCategories,
} from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ModalInfo from "./ModalInfo";

const CreateSlide = observer(({ show, onHide }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [file, setFile] = useState(null);

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const addSlide = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    formData.append("show", visible);
    formData.append("img", file);
    createSlide(formData).then((data) => {
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
            Додати Slide
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mt-4 w-25 d-inline-block ">Title</div>
            <Form.Control
              className="my-3 d-inline-block w-75"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={"Введіть головний текст"}
            />
            <div className="mt-4 w-25 d-inline-block ">Text</div>
            <Form.Control
              className="my-3 d-inline-block w-75"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"Введіть другий текст"}
            />

            <div className="mt-4 w-25 d-inline-block ">
              Виберiть фото слайду
            </div>
            <Form.Control
              className="my-3 d-inline-block w-75"
              type="file"
              onChange={selectFile}
            />

            <div className="mt-4 w-75 d-inline-block ">
              Виберiть, чи буде показаний слайд
            </div>
            <Form.Check
              checked={visible}
              className="my-3 d-inline-block w-25"
              type="switch"
              label="Вкл/викл"
              onChange={() => setVisible(!visible)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Закрити
          </Button>
          <Button variant="outline-success" onClick={addSlide}>
            Додати
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalInfo
        info={`Slide успішно доданий! `}
        color="text-success"
        show={showInfo}
      />
    </>
  );
});

export default CreateSlide;
