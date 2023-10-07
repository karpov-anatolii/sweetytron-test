import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const ModalInfo = (props) => {
  const color = props.color ?? "text-dark";
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title className={` ${color}`}>{props.info}</Modal.Title>
      </Modal.Header>
    </Modal>
  );
};

export default ModalInfo;
