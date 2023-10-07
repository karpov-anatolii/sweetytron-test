import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createCategory, fetchCategories } from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ModalInfo from "./ModalInfo";

const CreateCategory = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [value, setValue] = useState(""); 
  const [showInfo, setShowInfo] = useState(false);
  const [file, setFile] = useState(null);

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const addCategory = () => {
    if (value == "") {
      alert("Введiть назву категорii!");
      return;
    }
    const formData = new FormData();
    formData.append("name", value);
    formData.append("img", file);
    createCategory(formData).then((data) => {
      fetchCategories().then((data) => device.setCategories(data));
      setValue("");
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
            Додати категорію
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mt-4 w-25 d-inline-block ">Назва категорii</div>
            <Form.Control
              className="my-3 d-inline-block w-75"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={"Введіть назву категорії"}
            />
            <div className="mt-4 w-25 d-inline-block ">
              Виберiть фото категорii
            </div>
            <Form.Control
              className="my-3 d-inline-block w-75"
              type="file"
              onChange={selectFile}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Закрити
          </Button>
          <Button variant="outline-success" onClick={addCategory}>
            Додати
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalInfo
        info={`Категорiя успішно додана! `}
        color="text-success"
        show={showInfo}
        // onHide={handleCloseInfo}
      />
    </>
  );
});

export default CreateCategory;
