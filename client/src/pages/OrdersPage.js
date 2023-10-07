import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Container,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { fetchOneDevice } from "../http/deviceAPI";
import { deleteOrder, fetchOrders } from "../http/orderAPI";

const OrdersPage = observer(() => {
  const { order } = useContext(Context);

  let count = 1;

  return (
    <Container
      style={{ minHeight: window.innerHeight - 232 }}
      className="d-flex flex-column"
    >
      {order.receiveOrders.length === 0 && (
        <div className="text-center m-5 fw-bold">Замовлень поки що нема(</div>
      )}
      <Row>
        {order.receiveOrders.map((orderItem) => (
          <Row>
            <Card className="my-4">
              <div className="text-center  fs-3 m-4">
                Замовлення № {count++}
                <Button
                  variant="warning"
                  className="float-end"
                  onClick={() =>
                    deleteOrder(orderItem.id)
                      .then((res) => fetchOrders())
                      .then((data) => order.setReceiveOrder(data))
                  }
                >
                  Видалити
                </Button>
              </div>
              <ListGroup as="ol" numbered>
                {JSON.parse(orderItem.itemQuan).map((el) => (
                  <ListGroup.Item
                    as="li"
                    key={el.id}
                    className="d-flex flex-wrap  align-items-center "
                  >
                    <Image
                      className="m-2"
                      width={100}
                      height={100}
                      src={
                        process.env.REACT_APP_API_URL +
                        "images/thumbs/" +
                        JSON.parse(el.img)[0]
                      }
                    />
                    <div style={{ fontWeight: "bold", margin: "0 20px" }}>
                      {el.name + " : "}
                      <span className="fw-normal">{el.price + " грн"}</span>
                      <br />
                      <span className="fw-light">
                        {"Код:" + el.id}
                        {" Кiлькiсть:" + el.quan}
                      </span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="m-2 d-flex flex-wrap">
                <span className="fw-bold ms-2">{orderItem.name}</span>
                <span className="fw-bold ms-2">{orderItem.surName}</span>
                <span className="ms-2">{orderItem.phone}</span>
              </div>
              <div className="m-2 d-flex flex-wrap">
                <div className="m-2">{orderItem.city}</div>
                <div className="m-2">{orderItem.delivery}</div>
                <div className="m-2">{orderItem.department}</div>
              </div>
              <div className="m-2 d-flex flex-wrap">
                <div className="m-2">{orderItem.payment}</div>
                <div className="m-2">{orderItem.sum}грн.</div>
              </div>
            </Card>
          </Row>
        ))}
      </Row>
    </Container>
  );
});

export default OrdersPage;
