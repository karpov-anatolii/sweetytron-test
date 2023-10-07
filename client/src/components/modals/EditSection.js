import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Dropdown, Form, Image, Modal } from "react-bootstrap";
import { Context } from "../..";
import {
  deleteCategory,
  deleteSection,
  editSection,
  fetchCategories,
  fetchSections,
} from "../../http/deviceAPI";
import ModalInfo from "./ModalInfo";

const DeleteSection = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [showInfo, setShowInfo] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [modalInfo, setModalInfo] = useState("");

  useEffect(() => {
    fetchSections().then((data) => device.setSections(data));
  }, []);

  const edit_Section = (id) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("img", file);
    formData.append("id", id);
    editSection(formData).then((data) => {
      setFile(data);
      setModalInfo("Роздiл успiшно відредаговано!");
      setShowInfo(true);
      setTimeout(() => setShowInfo(false), 2000);
    });
  };

  const delSection = () => {
    deleteSection(device.selectedSection.id)
      .then((data) => fetchSections())
      .then((data) => {
        device.setSections(data);
        device.setSelectedSection({});
        onHide();
        setModalInfo("Роздiл успiшно видален!");
        setShowInfo(true);
        setTimeout(() => setShowInfo(false), 2000);
      });
  };
  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Редагувати роздiл
          </Modal.Title>
          <div className="mt-4 w-100 text-center ">
            <Image
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                marginLeft: "10px",
              }}
              src={process.env.REACT_APP_API_URL + "images/" + file}
              // src={process.env.REACT_APP_API_URL + file}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="w-25 d-inline-block">Виберiть категорiю</div>
            <Dropdown className="my-3 w-75 d-inline-block">
              <Dropdown.Toggle>
                {device.selectedCategory.name || "Виберiть  категорiю"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {device.categories.map((category) => (
                  <Dropdown.Item
                    onClick={() => {
                      device.setSelectedCategory(category);
                      fetchSections(category.id).then((data) => {
                        device.setSections(data);
                        if (data[0]) {
                          device.setSelectedSection(data[0]);
                        } else {
                          alert("Ще нема роздiлiв у цiй категорii");
                          device.setSelectedSection({});
                        }
                      });
                    }}
                    key={category.id}
                  >
                    {category.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <div className="w-25 d-inline-block">Виберiть Роздiл</div>
            <Dropdown className="my-3 w-75 d-inline-block">
              <Dropdown.Toggle>
                {device.selectedSection.name || "Виберiть  роздiл"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {device.sections.map((section) => (
                  <Dropdown.Item
                    onClick={() => {
                      device.setSelectedSection(section);
                      setFile(section.img);
                      setName(section.name);
                    }}
                    key={section.id}
                  >
                    {section.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form>
          <div className="mt-4 w-25 d-inline-block ">Назва роздiлу</div>
          <Form.Control
            className="my-3 d-inline-block w-75"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="mt-4 w-25 d-inline-block ">Виберiть фото роздiлу</div>
          <Form.Control
            className="my-3 d-inline-block w-75"
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <div className="text-danger m-2">
            Увага! При видаленi роздiлу видаляться також всі товари у вибраному
            роздiлу.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={onHide}>
            Закрити
          </Button>
          <Button variant="outline-danger" onClick={delSection}>
            Видалити
          </Button>
          <Button
            variant="outline-success"
            onClick={() => edit_Section(device.selectedSection.id)}
          >
            Редагувати
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalInfo info={modalInfo} color="text-success" show={showInfo} />
    </>
  );
});

export default DeleteSection;
