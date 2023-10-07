import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Container, Row } from "react-bootstrap";
import { Context } from "..";
import DeviceItem from "./DeviceItem";

const DeviceList = observer(() => {
  const { device } = useContext(Context);

  return (
    <Container>
      <Row className=" my-4">
        {device.devices.map((device) => (
          <DeviceItem key={device.id} device={device} />
        ))}
      </Row>
    </Container>
  );
});

export default DeviceList;
