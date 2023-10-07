import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Dropdown, Form, Image, Modal } from "react-bootstrap";
import { Context } from "../..";
import {
  deleteCategory,
  editCategory,
  fetchCategories,
} from "../../http/deviceAPI";
import ModalInfo from "./ModalInfo";

const DeleteCategory = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [showInfo, setShowInfo] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [modalInfo, setModalInfo] = useState("");

  useEffect(() => {
    fetchCategories().then((data) => device.setCategories(data));
  }, []);

  const edit_Category = (id) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("img", file);
    formData.append("id", id);
    editCategory(formData).then((data) => {
      setFile(data);
      setModalInfo("Категорiю успiшно відредаговано!");
      setShowInfo(true);
      setTimeout(() => setShowInfo(false), 2000);
    });
  };

  const delCategory = () => {
    if (
      !window.confirm(
        "Ви дiйсно хочете видалити цю категорiю?\nВсi роздiли з товарами видаляться автоматично з цією категорією. "
      )
    )
      return;
    deleteCategory(device.selectedCategory.id)
      .then((data) => fetchCategories())
      .then((data) => {
        device.setCategories(data);
        device.setSelectedCategory({});
        onHide();
        setModalInfo("Категорiя успiшно видалена!");
        setShowInfo(true);
        setTimeout(() => setShowInfo(false), 2000);
      });
  };
  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Редагувати категорію
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
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Dropdown className="my-3">
              <Dropdown.Toggle>
                {device.selectedCategory.name || "Виберiть категорiю"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {device.categories.map((category) => (
                  <Dropdown.Item
                    onClick={() => {
                      device.setSelectedCategory(category);
                      setFile(category.img);
                      setName(category.name);
                    }}
                    key={category.id}
                  >
                    {category.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form>
          <div className="mt-4 w-25 d-inline-block ">Назва категорії</div>
          <Form.Control
            className="my-3 d-inline-block w-75"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="mt-4 w-25 d-inline-block ">
            Виберiть фото категорії
          </div>
          <Form.Control
            className="my-3 d-inline-block w-75"
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <div className="text-danger m-2">
            Увага! При видаленi категорії видаляться також всі розділи та товари
            у вибраній категорії.{" "}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={onHide}>
            Закрити
          </Button>
          <Button variant="outline-danger" onClick={delCategory}>
            Видалити категорiю
          </Button>
          <Button
            variant="outline-success"
            onClick={() => edit_Category(device.selectedCategory.id)}
          >
            Редагувати
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalInfo
        info={modalInfo}
        color="text-success"
        show={showInfo}
      />
    </>
  );
});

export default DeleteCategory;
