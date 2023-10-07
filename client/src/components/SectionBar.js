import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Badge, Card, Col, Container, Row } from "react-bootstrap";
import { Context } from "..";
import { fetchDevices } from "../http/deviceAPI";

const SectionBar = observer(() => {
  const { device } = useContext(Context);

  return (
    <Container>
      <Row xs={2} sm={3} md={4} lg={5} xl={6} xxl={7} className="d-flex ">
        {device.sections.map((section) => (
          <Col className="p-0 " key={section.id}>
            <Card
              className="bg-white text-shadow-1 border-2  p-1 text-white"
              style={{ cursor: "pointer", height: "150px" }}
              onClick={() => {
                device.setSelectedSection(section);
              }}
              border={
                section.id === device.selectedSection.id ? "warning" : "light"
              }
            >
              <Card.Img
                className="section-img"
                src={process.env.REACT_APP_API_URL + "images/" + section.img}
                alt="Card image"
              />
              <Card.ImgOverlay className="d-flex align-items-center">
                <Card.Title className="fs-3 fw-bolder m-auto">
                  <Badge
                    bg="dark"
                    className="section-name bg-opacity-50 text-wrap"
                  >
                    {section.name}
                  </Badge>
                </Card.Title>
              </Card.ImgOverlay>
            </Card>
          </Col>
        ))}
        <Col className="p-0" key={"all"}>
          <Card
            style={{ cursor: "pointer", height: "150px" }}
            className="bg-white text-shadow-1 border-2  p-1 text-white"
            onClick={() => {
              fetchDevices(
                device.selectedCategory.id,
                null,
                1,
                device.limit
              ).then((data) => {
                console.log(data);
                device.setTotalCount(data.count); //получаем от сервера общее кол-во товаров в выделенной категории
                device.setDevices(data.rows);
                device.setSelectedSection("all");
              });
            }}
            border={device.selectedSection === "all" ? "warning" : "light"}
          >
            <Card.Img
              style={{ height: "100%", objectFit: "cover" }}
              src={
                process.env.REACT_APP_API_URL +
                "images/" +
                device.selectedCategory.img
              }
              alt="Category image"
            />
            <Card.ImgOverlay className="d-flex align-items-center">
              <Card.Title className="fs-3 fw-bolder m-auto">
                <Badge
                  bg="dark"
                  className=" section-name bg-opacity-50 text-wrap"
                >
                  {"Усі товари категорії"}{" "}
                </Badge>
              </Card.Title>
            </Card.ImgOverlay>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});

export default SectionBar;
