import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "..";
import EditDevice from "../components/modals/EditDevice";
import ModalInfo from "../components/modals/ModalInfo";
import { deleteDevice, fetchOneDevice } from "../http/deviceAPI";

const EditDevicePage = observer(() => {
  const { device } = useContext(Context);

  const [editDeviceVisible, setEditDeviceVisible] = useState(false);
  const params = useParams();
  const deviceId = params.id;
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  const deleteDev = async (id) => {
    await deleteDevice(id);
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <Container
      style={{ minHeight: window.innerHeight - 232 }}
      className="d-flex flex-column"
    >
      <Button
        variant="outline-dark"
        className="my-3"
        onClick={() => setEditDeviceVisible(true)}
      >
        Вiдредагувати товар
      </Button>
      <Button
        variant="outline-dark"
        className="my-3"
        onClick={() => {
          if (!window.confirm("Ви дiйсно хочете видалити цей товар? ")) return;
          deleteDev(deviceId).then((res) => {
            setShowInfo(true);
            setTimeout(() => setShowInfo(false), 2000);
          });
        }}
      >
        Видалити товар
      </Button>
      <EditDevice
        show={editDeviceVisible}
        onHide={() => setEditDeviceVisible(false)}
      />
      <ModalInfo
        info={`Товар успішно видалено! `}
        color="text-success"
        show={showInfo}
      />
    </Container>
  );
});

export default EditDevicePage;
