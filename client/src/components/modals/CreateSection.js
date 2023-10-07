import React, { useContext, useEffect, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import {
  createCategory,
  createSection,
  fetchCategories,
  fetchSections,
} from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ModalInfo from "./ModalInfo";

const CreateSection = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [value, setValue] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCategories().then((data) => device.setCategories(data));
  }, []);

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const addSection = () => {
    if (value == "") {
      alert("Введiть назву роздiла!");
      return;
    }
    const formData = new FormData();
    formData.append("name", value);
    formData.append("img", file);
    formData.append("categoryId", device.selectedCategory.id);

    createSection(formData).then((data) => {
      fetchSections().then((data) => device.setSections(data));
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
            Додати роздiл
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="w-25 d-inline-block">Назва</div>
            <Form.Control
              className="w-75 d-inline-block"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={"Введіть назву роздiла"}
            />

            <div className="mt-4 ">
              Виберiть категорiю, до якої буде вiдноситись цей роздiл
            </div>
            <Dropdown className="my-2">
              <Dropdown.Toggle>
                {device.selectedCategory.name || "Виберiть категорiю"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {device.categories.map((category) => (
                  <Dropdown.Item
                    onClick={() => device.setSelectedCategory(category)}
                    key={category.id}
                  >
                    {category.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
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
          <Button variant="outline-success" onClick={addSection}>
            Додати
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalInfo
        info={`Розділ успішно доданий! `}
        color="text-success"
        show={showInfo}
      />
    </>
  );
});

export default CreateSection;
