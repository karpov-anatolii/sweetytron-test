import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import {
  createDevice,
  editDevice,
  fetchCategories,
  fetchOneDevice,
  fetchSections,
  fetchSectionsAll,
} from "../../http/deviceAPI";
import { Context } from "../../index";
import ModalInfo from "./ModalInfo";

const EditDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const params = useParams();
  const deviceId = params.id;
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [file, setFile] = useState([]);
  const [info, setInfo] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const statusArr = [
    "В наявності",
    "Закінчується",
    "На складі",
    "Розпродаж",
    "Розпродаж залишку",
    "Ціна знижена",
    "Немає в наявності",
  ];
  const badgeArr = [
    "-5%",
    "-10%",
    "-15%",
    "-20%",
    "-25%",
    "-50%",
    "ТОП",
    "ТОП ПРОДАЖIВ",
    "УКРАЇНА",
    "НОВИНКА",
  ];
  const [statusInput, setStatusInput] = useState("");
  const [statusDropDown, setStatusDropDown] = useState("");
  const [badgeInput, setBadgeInput] = useState("");
  const [badgeDropDown, setBadgeDropDown] = useState("");

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        device.setCategories(data);
      })
      .then((res) => fetchSectionsAll())
      .then((data) => {
        device.setSections(data);
      })
      .then((data) => fetchOneDevice(deviceId))
      .then((data) => {
        setInfo(data.info);
        let editDeviceObj = device.devices.filter((el) => el.id == deviceId)[0];
        if (device.devices.length == 0) {
          device.setDevices([data]);
          editDeviceObj = data;
        }
        setName(editDeviceObj.name);
        setPrice(editDeviceObj.price);
        setFile(JSON.parse(editDeviceObj.img));
        setStatusInput(editDeviceObj.status);
        setBadgeInput(editDeviceObj.badge);

        const deviceCategoryObj = device.categories.filter(
          (el) => el.id == editDeviceObj.categoryId
        )[0];
        device.setSelectedCategory(deviceCategoryObj);
        const deviceSectionObj = device.sections.filter(
          (el) => el.id == editDeviceObj.sectionId
        )[0];

        device.setSelectedSection(deviceSectionObj);
      })
      .catch((e) => console.log(e.message));
  }, []);

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", id: `${Date.now()}` }]);
  };

  const addPhoto = () => {
    setFile([...file, 1]);
  };

  const removeInfo = (id) => {
    setInfo(info.filter((i) => i.id !== id));
  };

  const removePhoto = (number) => {
    setFile(file.filter((el, index) => index !== number));
  };

  const changeInfo = (key, value, id) => {
    //key  это или title или description, value это значение для этого ключа и number - номер характеристики, по которой это значение будем изменять
    setInfo(
      info.map((i) => (i.id == id ? { ...i, [key]: value } : i)) // по ключу заменяем поле
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
    const formData = new FormData(); // сервер ждет formData, а не строку JSON
    formData.append("name", name);
    formData.append("id", deviceId);
    formData.append("price", `${price}`); //значение может быть либо строка либо blob(набор битов), но не цифра, поэтому price конвертируем в строку
    formData.append("status", `${statusInput || statusDropDown}`);
    formData.append("badge", `${badgeInput || null}`);
    file.map((el, index) => formData.append(`img${index + 1}`, el));
    formData.append("file", JSON.stringify(file));
    formData.append("categoryId", device.selectedCategory.id);
    formData.append("sectionId", device.selectedSection.id); //отправляем только id, а не объект целиком
    formData.append("info", JSON.stringify(info)); //массив info пердавать на сервер нельзя, поэтому преобразовываем в строку. А на сервере будем парсить обратно
    editDevice(formData)
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
          <Modal.Title id="contained-modal-title-vcenter" className="w-50">
            Відредагувати товар
          </Modal.Title>
          <Row>
            <Image
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
              }}
              src={process.env.REACT_APP_API_URL + "images/thumbs/" + file[0]}
            />
          </Row>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="w-25 d-inline-block">Нова Категорiя</div>
            <Dropdown className="my-3 w-75 d-inline-block">
              <Dropdown.Toggle>
                {device.selectedCategory.name || "Виберiть нову категорiю"}
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
            <div className="w-25 d-inline-block">Новий Роздiл</div>
            <Dropdown className="my-3 w-75 d-inline-block">
              <Dropdown.Toggle>
                {device.selectedSection.name || "Виберiть новий роздiл"}
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
                        setStatusInput(status);
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
                Введіть текст акції або залиште поле пустим
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
              <div
                className="d-flex flex-wrap align-items-center"
                key={index}
                onClick={() => console.log(file)}
              >
                <div className="w-50 d-inline-block">Нове фото{index + 1}</div>
                <Button
                  style={{ width: "10%" }}
                  className="ms-5 my-3 w-25 px-1 d-inline-block "
                  variant="danger"
                  onClick={() => removePhoto(index)}
                >
                  <FaTrash className="tr-sc-1-2" />
                </Button>
                <div className="my-3 mt-0 mb-4  d-inline-block w-100 position-relative">
                  <Form.Control
                    className="w-100"
                    style={{ paddingRight: "75%", fontSize: "0.7em" }}
                    type="file"
                    name={`img${index + 1}`}
                    onChange={(e) => selectFile(e, index)}
                  />
                  <div
                    className="position-absolute  "
                    style={{ left: "25%", top: "-5%", fontSize: "0.7em" }}
                  >
                    {typeof el === "string" ? el : el.name}
                  </div>
                </div>
              </div>
            ))}
            <hr />

            <Button variant="outline-dark" onClick={addInfo}>
              Додати новий опис товару
            </Button>
            {info.map((i) => (
              <Row className="mt-4 device-info" key={i.id}>
                <Col xs={4}>
                  <Form.Control
                    value={i.title}
                    onChange={(e) => changeInfo("title", e.target.value, i.id)}
                    placeholder="Назва"
                  />
                </Col>
                <Col xs={6}>
                  <Form.Control
                    value={i.description}
                    onChange={(e) =>
                      changeInfo("description", e.target.value, i.id)
                    }
                    placeholder="Опис властивості"
                  />
                </Col>
                <Col xs={1}>
                  <Button variant="danger" onClick={() => removeInfo(i.id)}>
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
        info={`Товар успішно відредаговано! `}
        color="text-success"
        show={showInfo}
      />
    </>
  );
});

export default EditDevice;
