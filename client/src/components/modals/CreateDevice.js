import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { Context } from "../..";
import {
  createDevice,
  fetchBrands,
  fetchCategories,
  fetchSections,
  fetchSectionsAll,
  fetchTypes,
} from "../../http/deviceAPI";
import { FaTrash } from "react-icons/fa";
import ModalInfo from "./ModalInfo";
import { statusArr, badgeArr, countryArr, tasteArr } from "../../utils/consts";

const CreateDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState([1]);
  const [info, setInfo] = useState([
    { title: "Опис товару", description: "", number: "0" },
    { title: "Країна виробник", description: "Україна", number: "1" },
    { title: "Вирощувач сировини", description: "Україна", number: "2" },
    { title: "Вага", description: "0 гр.", number: "3" },
    { title: "Кiлькiсть у пачцi", description: "10 шт.", number: "4" },
    { title: "Склад", description: "", number: "5" },
    { title: "Термін зберігання", description: "12 мiсяцiв", number: "6" },
    { title: "Смак", description: "Солодке", number: "7" },
  ]);
  const [showInfo, setShowInfo] = useState(false);
  const [statusInput, setStatusInput] = useState(statusArr[0]);
  const [statusDropDown, setStatusDropDown] = useState("");
  const [badgeInput, setBadgeInput] = useState("");
  const [badgeDropDown, setBadgeDropDown] = useState("");

  useEffect(() => {
    fetchCategories().then((data) => device.setCategories(data));
    fetchSections().then((data) => device.setSections(data));
  }, []);

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", number: `${Date.now()}` }]);
  };

  const addPhoto = () => {
    setFile([...file, 1]);
  };

  const removeInfo = (number) => {
    setInfo(info.filter((i) => i.number !== number));
  };

  const removePhoto = (number) => {
    setFile(file.filter((el, index) => index !== number));
  };

  const changeInfo = (key, value, number) => {
    setInfo(
      info.map((i) => (i.number === number ? { ...i, [key]: value } : i)) // по ключу заменяем поле
    );
  };

  const selectFile = (e, number) => {
    if (!file[number]) {
      setFile([...file, e.target.files[0]]);
    } else {
      setFile(
        file.map((el, index) => (index === number ? e.target.files[0] : el))
      );
    }
  };

  const addDevice = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", `${price}`); //значение может быть либо строка либо blob(набор битов), но не цифра, поэтому price конвертируем в строку
    formData.append("status", `${statusInput || statusDropDown}`);
    formData.append("badge", `${badgeInput || null}`);
    file.map((el, index) => formData.append(`img${index + 1}`, el));
    formData.append("categoryId", device.selectedCategory.id);
    formData.append("sectionId", device.selectedSection.id);
    formData.append("info", JSON.stringify(info)); //массив info пердавать на сервер нельзя, поэтому преобразовываем в строку. А на сервере будем парсить обратно

    createDevice(formData)
      .then((data) => {
        onHide();
        setShowInfo(true);
        setTimeout(() => setShowInfo(false), 2000);
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Додати товар
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="w-25 d-inline-block">Категорiя</div>
            <Dropdown className="my-3 w-75 d-inline-block">
              <Dropdown.Toggle>
                {device.selectedCategory.name || "Виберiть категорiю"}
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
            <div className="w-25 d-inline-block">Роздiл</div>
            <Dropdown className="my-3 w-75 d-inline-block">
              <Dropdown.Toggle>
                {device.selectedSection.name || "Виберiть роздiл"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {device.sections.map((section) => (
                  <Dropdown.Item
                    onClick={() => {
                      device.setSelectedSection(section);
                    }}
                    key={section.id}
                  >
                    {section.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <div className="w-25 d-inline-block">Назва</div>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="my-3 w-75 d-inline-block"
              placeholder="Введіть назву товару"
            />

            <div className="w-25 d-inline-block">Цiна</div>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className=" w-75 d-inline-block "
              placeholder="100"
              type="number"
            />

            <Card className="my-4">
              <div className="mt-3 mx-2">
                Введіть статус товару або виберіть зі списку
              </div>
              <Form.Control
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="m-3 d-inline-block w-75"
                placeholder="В наявності"
              />
              <Dropdown className="mx-3 mb-3">
                <Dropdown.Toggle>
                  {statusDropDown || "Виберiть статус"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {statusArr.map((status) => (
                    <Dropdown.Item
                      onClick={() => {
                        setStatusDropDown(status);
                      }}
                      key={status}
                    >
                      {status}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card>
            <Card className="my-4">
              <div className="mt-3 mx-2">
                Введіть текст акції або оберiть iз списку або залиште поле
                пустим
              </div>
              <Form.Control
                value={badgeInput}
                onChange={(e) => setBadgeInput(e.target.value)}
                className="m-3 d-inline-block w-75"
                placeholder="Текст акції"
              />
              <Dropdown className="mx-3 mb-3">
                <Dropdown.Toggle>
                  {badgeDropDown || "Без акції"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {badgeArr.map((badge) => (
                    <Dropdown.Item
                      onClick={() => {
                        setBadgeDropDown(badge);
                        setBadgeInput(badge);
                      }}
                      key={badge}
                    >
                      {badge}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card>
            <Button variant="outline-dark" onClick={addPhoto}>
              Додати ще фото
            </Button>
            {file.map((el, index) => (
              <div className="d-flex align-items-center" key={index}>
                <div className="w-25 d-inline-block">
                  Фото товара{index + 1}
                </div>
                <Form.Control
                  className="my-3  d-inline-block w-50"
                  type="file"
                  name={`img${index + 1}`}
                  onChange={(e) => selectFile(e, index)}
                />
                <Button
                  style={{ width: "10%" }}
                  className="ms-5 my-3 px-1 d-inline-block "
                  variant="danger"
                  onClick={() => removePhoto(index)}
                >
                  <FaTrash className="tr-sc-1-2" />
                </Button>
              </div>
            ))}

            <hr />
            <Button variant="outline-dark" onClick={addInfo}>
              Додати новий опис товару
            </Button>
            {info.map((i) => (
              <Row className="mt-4 device-info" key={i.number}>
                <Col xs={4}>
                  <Form.Control
                    value={i.title}
                    onChange={(e) =>
                      changeInfo("title", e.target.value, i.number)
                    }
                    placeholder="Назва "
                  />
                </Col>
                <Col xs={6} className="d-flex flex-row">
                  {(i.number === "1" || i.number === "2") && (
                    <Dropdown className="mx-1 ">
                      <Dropdown.Toggle>
                        {i.description || "Країна"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {countryArr.map((country) => (
                          <Dropdown.Item
                            onClick={() => {
                              changeInfo("description", country, i.number);
                            }}
                            key={country}
                          >
                            {country}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                  {i.number === "7" && (
                    <Dropdown className="mx-1 ">
                      <Dropdown.Toggle>
                        {i.description || "Смак"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {tasteArr.map((taste) => (
                          <Dropdown.Item
                            onClick={() => {
                              changeInfo("description", taste, i.number);
                            }}
                            key={taste}
                          >
                            {taste}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                  <Form.Control
                    value={i.description}
                    onChange={(e) =>
                      changeInfo("description", e.target.value, i.number)
                    }
                    placeholder="Опис властивості"
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    className=""
                    variant="danger"
                    onClick={() => removeInfo(i.number)}
                  >
                    <FaTrash className="tr-sc-1-2" />
                  </Button>
                </Col>
              </Row>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Закрити
          </Button>
          <Button variant="outline-success" onClick={addDevice}>
            Додати
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalInfo
        info={`Товар успішно доданий! `}
        color="text-success"
        show={showInfo}
      />
    </>
  );
});

export default CreateDevice;
