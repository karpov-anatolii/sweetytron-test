import React from "react";
import { Button, Modal, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Field, Form, Formik } from "formik";
import { createComment } from "../../http/deviceAPI";

const CreateComment = observer(({ show, onHide, id, setInfoText }) => {
  const validateEmptyMax = (value) => {
    if (!value) {
      return "Треба заповнити!";
    } else if (value.length > 300) {
      return "Максимум 300 символiв!";
    }
  };

  const validateMax = (value) => {
    if (value.length > 300) {
      return "Максимум 300 символiв!";
    }
  };

  const addComment = async (value) => {
    try {
      const data = await createComment(
        value.name,
        value.comment,
        value.advantage,
        value.flaw,
        id
      );
      onHide();
      setInfoText(`Вiдгук  успішно доданий! `);
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Додати вiдгук
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: "",
              comment: "",
              advantage: "",
              flaw: "Немає",
            }}
            onSubmit={(values) => {
              addComment(values);
            }}
          >
            {({ errors, touched }) => (
              <Form className="d-flex flex-column">
                <div className="d-flex flex-column position-relative">
                  <label className="mt-4">Ваше iм'я та прiзвище:</label>
                  <Field
                    className="mb-3"
                    name="name"
                    validate={validateEmptyMax}
                  />
                  {errors.name && touched.name && (
                    <div className="formik-err">{errors.name}</div>
                  )}
                </div>

                <div className="d-flex flex-column position-relative">
                  <label className="mt-3">Вiдгук:</label>
                  <Field
                    className="mb-3"
                    as="textarea"
                    name="comment"
                    validate={validateEmptyMax}
                  />
                  {errors.comment && touched.comment && (
                    <div className="formik-err">{errors.comment}</div>
                  )}
                </div>

                <div className="d-flex flex-column position-relative">
                  <label className="mt-3">Переваги:</label>
                  <Field
                    className="mb-3"
                    name="advantage"
                    validate={validateMax}
                  />
                  {errors.advantage && touched.advantage && (
                    <div className="formik-err">{errors.advantage}</div>
                  )}
                </div>

                <div className="d-flex flex-column position-relative">
                  <label className="mt-3">Недоліки:</label>
                  <Field className="mb-3" name="flaw" validate={validateMax} />
                  {errors.flaw && touched.flaw && (
                    <div className="formik-err">{errors.flaw}</div>
                  )}
                </div>
                <Row className="justify-content-around">
                  <Button variant="outline-danger w-25" onClick={onHide}>
                    Закрити
                  </Button>
                  <Button variant="outline-success w-25" type="submit">
                    Додати
                  </Button>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
});

export default CreateComment;
