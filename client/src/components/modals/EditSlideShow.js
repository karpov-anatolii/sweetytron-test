import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Form, Image, Modal } from "react-bootstrap";
import {
  createCategory,
  createSlide,
  deleteSlide,
  editSlide,
  fetchCategories,
  fetchSlideShow,
} from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ModalInfo from "./ModalInfo";

const EditSlideShow = observer(({ show, onHide }) => {
  const [title, setTitle] = useState([]);
  const [text, setText] = useState([]);
  const [visible, setVisible] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [file, setFile] = useState(null);
  const [slideData, setSlideData] = useState([]);

  useEffect(() => {
    fetchSlideShow().then((data) => {
      setSlideData(data);
      setTitle(data.map((el) => el.title));
      setText(data.map((el) => el.text));
      setVisible(data.map((el) => el.show));
      setFile(data.map((el) => el.img));
    });
  }, []);

  const editSlideShow = (index, id) => {
    const formData = new FormData();
    formData.append("title", title[index]);
    formData.append("text", text[index]);
    formData.append("show", visible[index]);
    formData.append("img", file[index]);
    formData.append("id", id);
    formData.append("oldFileName", slideData.filter((el) => el.id == id).img);
    editSlide(formData).then((data) => {
      setFile(file.map((el, ind) => (ind == index ? data : el)));
      setShowInfo(true);
      setTimeout(() => setShowInfo(false), 2000);
    });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Редагувати SlideShow
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {slideData.map((slide, index) => (
              <div className="border rounded-2 p-3" key={index}>
                <div className="mt-4 w-100 text-center ">
                  SlideShow {index + 1}
                  <Image
                    style={{
                      width: "300px",
                      height: "52px",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    src={
                      process.env.REACT_APP_API_URL + "images/" + file[index]
                    }
                  />
                </div>
                <span className="mt-4  w-25 d-inline-block  ">Title</span>
                <Form.Control
                  className="my-3  w-75 d-inline-block"
                  value={title[index]}
                  onChange={(e) =>
                    setTitle(
                      title.map((el, i) => (index == i ? e.target.value : el))
                    )
                  }
                  placeholder={slide.title}
                />
                <div className="mt-4 w-25 d-inline-block ">Text</div>
                <Form.Control
                  className="my-3 d-inline-block w-75"
                  value={text[index]}
                  onChange={(e) =>
                    setText(
                      text.map((el, i) => (index == i ? e.target.value : el))
                    )
                  }
                  placeholder={slide.text[index]}
                />

                <div className="mt-4 w-25 d-inline-block ">
                  Виберiть фото слайду
                </div>
                <Form.Control
                  className="my-3 d-inline-block w-75"
                  type="file"
                  onChange={(e) =>
                    setFile(
                      file.map((el, i) => (index == i ? e.target.files[0] : el))
                    )
                  }
                />

                <div className="mt-4 w-75 d-inline-block ">
                  Виберiть, чи буде показаний слайд
                </div>
                <Form.Check
                  className="my-3 d-inline-block w-25"
                  checked={visible[index]}
                  type="switch"
                  label="Вкл/викл"
                  onChange={() =>
                    setVisible(visible.map((el, i) => (index == i ? !el : el)))
                  }
                />
                <Button
                  className=" d-inline-block w-25 m-5"
                  variant="warning"
                  onClick={() => editSlideShow(index, slide.id)}
                >
                  Змiнити
                </Button>
                <Button
                  className=" d-inline-block w-25 m-5"
                  variant="danger"
                  onClick={() => {
                    deleteSlide(slide.id).then(() => {
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
        info={`SlideShow успішно змiнено! `}
        color="text-success"
        show={showInfo}
      />
    </>
  );
});

export default EditSlideShow;
