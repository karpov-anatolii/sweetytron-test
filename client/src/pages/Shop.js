import React, { useContext, useEffect, useRef, useState } from "react";
import { Badge, Col, Collapse, Container, Row } from "react-bootstrap";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "./../index";
import {
  fetchActionItems,
  fetchCategories,
  fetchDevices,
  fetchHotItems,
  fetchSections,
  fetchTopItems,
} from "../http/deviceAPI";
import Pages from "../components/Pages";
import CategoryBar from "../components/CategoryBar";
import SectionBar from "../components/SectionBar";
import { useSearchParams } from "react-router-dom";
import SlideShow from "./../components/SlideShow";
import SlideBar from "../components/SlideBar";

const Shop = observer(() => {
  const { device, order, info } = useContext(Context);
  let [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category"));
  const [section, setSection] = useState(searchParams.get("section"));
  const [actionItems, setActionItems] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [hotItems, setHotItems] = useState([]);
  const [openSlideShow, setOpenSlideShow] = useState(true);
  const divider = useRef();

  const deviderTop = () => {
    setTimeout(() => {
      divider.current.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  useEffect(() => {
    let sessionOrder = sessionStorage.getItem("order");
    if (sessionOrder) {
      order.clearOrder();
      JSON.parse(sessionOrder).map((el) => order.setOrder(el));
    }

    fetchActionItems(1, 20)
      .then((data) => {
        setActionItems(data.rows);
      })
      .catch((err) => console.log(err));

    fetchTopItems(1, 20)
      .then((data) => {
        setTopItems(data.rows);
      })
      .catch((err) => console.log(err));

    fetchHotItems(1, 20)
      .then((data) => {
        setHotItems(data.rows);
      })
      .catch((err) => console.log(err));

    fetchCategories()
      .then((data) => {
        device.setCategories(data);
        category &&
          category !== "null" &&
          device.setSelectedCategory(data.filter((el) => el.id == category)[0]);
        if (section === "all") {
          fetchDevices(category, null, 1, device.limit).then((data) => {
            device.setTotalCount(data.count);
            device.setDevices(data.rows);
            device.setSelectedSection("all");
          });
          fetchSections(category).then((data) => {
            device.setSections(data);
          });
        }
        if (section && section !== "all") {
          fetchSections(category).then((data) => {
            device.setSections(data);
            device.setSelectedSection(data.filter((el) => el.id == section)[0]);
          });
        }
      })
      .catch((e) => console.log(e.message));
  }, []);

  useEffect(() => {
    device.selectedCategory.id &&
      (device.selectedSection.id || device.selectedSection === "all") &&
      fetchDevices(
        device.selectedCategory.id,
        device.selectedSection.id,
        device.page,
        device.limit
      ).then((data) => {
        device.setTotalCount(data.count);
        device.setDevices(data.rows);
      });
  }, [device.page, device.selectedCategory, device.selectedSection]);

  return (
    <Container style={{ minHeight: window.innerHeight - 232 }}>
      {!device.selectedCategory.id && (
        <Row>
          <Collapse in={openSlideShow}>
            <div id="slideshow">
              <SlideShow />

              {info.articles.map(
                (el) =>
                  el.show_main && (
                    <Row key={el.id} className="bg-body-secondary">
                      <div className="text-center m-2 fs-4 fw-bold text-danger">
                        {el.title}
                      </div>
                      <div className=" m-3 mt-2 fs-6 text-dark">
                        {el.content}
                      </div>
                    </Row>
                  )
              )}
            </div>
          </Collapse>
        </Row>
      )}
      <div
        aria-controls="slideshow"
        aria-expanded={openSlideShow}
        onClick={() => setOpenSlideShow(false)}
      >
        <Row>
          <CategoryBar />
        </Row>

        <Row className="mt-2">
          {device.selectedCategory.id ? (
            <Col>
              <div onClick={deviderTop}>
                <SectionBar />
              </div>

              <Row className="divider" ref={divider}></Row>

              <DeviceList />

              <div onClick={deviderTop}>
                <Pages />
              </div>
            </Col>
          ) : (
            <Col>
              <div className="text-center mt-3">
                <Badge
                  pill
                  bg={"warning"}
                  className=" text-danger fw-bold fs-3"
                >
                  Акційні товари
                </Badge>
              </div>
              <SlideBar devices={actionItems} />
              <div className="text-center mt-3">
                <Badge
                  pill
                  bg={"warning"}
                  className=" text-danger fw-bold fs-3"
                >
                  Топ продажів
                </Badge>
              </div>
              <SlideBar devices={topItems} />
              <div className="text-center mt-3">
                <Badge
                  pill
                  bg={"warning"}
                  className=" text-danger fw-bold fs-3"
                >
                  Гарячі новинки
                </Badge>
              </div>
              <SlideBar devices={hotItems} />
            </Col>
          )}
        </Row>
      </div>
    </Container>
  );
});

export default Shop;
