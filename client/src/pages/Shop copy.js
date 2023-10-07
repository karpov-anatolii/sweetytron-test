import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import TypeBar from "../components/TypeBar";
import { observer } from "mobx-react-lite";
import { Context } from "./../index";
import {
  fetchActionItems,
  fetchBrands,
  fetchCategories,
  fetchDevices,
  fetchSections,
  fetchSectionsAll,
  fetchTypes,
} from "../http/deviceAPI";
import Pages from "../components/Pages";
import CategoryBar from "../components/CategoryBar";
import SectionBar from "../components/SectionBar";
import { useSearchParams } from "react-router-dom";
import SlideShow from "./../components/SlideShow";
import Footer from "../components/Footer";
import SlideBar from "../components/SlideBar";

const Shop = observer(() => {
  const { device } = useContext(Context);
  let [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category"));
  const [section, setSection] = useState(searchParams.get("section"));
  const [actionItems, setActionItems] = useState();

  useEffect(() => {
    console.log("SHOP USEEFFECT+++++++++++=====actionItems=", actionItems);
    fetchActionItems(1, 20)
      .then((data) => {
        setActionItems(data);
      })
      .catch((err) => console.log(err));

    fetchCategories()
      .then((data) => {
        device.setCategories(data);
        category && category !== "null"
          ? device.setSelectedCategory(
              data.filter((el) => el.id == category)[0]
            )
          : device.setSelectedCategory(null);

        return category && category !== "null"
          ? fetchSections(category)
          : fetchSectionsAll(); //fetchSectionsAll получаем массив  разделов первой категории
      })
      .then((data) => {
        console.log(" 2 fetchSectionsAll=", data);
        device.setSections(data);
        section && section !== "null"
          ? device.setSelectedSection(data.filter((el) => el.id == section)[0])
          : device.setSelectedSection(null);
        // : device.setSelectedSection(data[0]); //устанавливаем в выбранную первый раздел
      })
      .then(
        (res) =>
          device.selectedCategory &&
          device.selectedSection &&
          fetchDevices(
            device.selectedCategory.id,
            device.selectedSection.id,
            1,
            device.limit
          )
      )
      .then((data) => {
        device.setTotalCount(data.count); //получаем от сервера общее кол-во товаров
        device.setDevices(data.rows);
      }) //список девайсов получаем из поля rows, т.к мы добавили пагинацию на сервере для этой страницы
      .catch((e) => console.log(e.message));
  }, []);

  useEffect(() => {
    device.selectedCategory &&
      device.selectedSection &&
      fetchDevices(
        device.selectedCategory.id,
        device.selectedSection.id,
        device.page,
        device.limit
      ).then((data) => {
        // последний аргумент - лимит товаров на 1 странице
        device.setTotalCount(data.count); //получаем от сервера общее кол-во товаров
        device.setDevices(data.rows);
      }); //список девайсов получаем из поля rows, т.к мы добавили пагинацию на сервере для этой страницы
  }, [device.page, device.selectedCategory, device.selectedSection]);

  return (
    <Container style={{ minHeight: window.innerHeight - 232 }}>
      <Row>
        <SlideShow />
      </Row>
      <Row>
        <CategoryBar />
      </Row>

      <Row className="mt-2">
        {device.selectedCategory && device.selectedSection ? (
          <Col>
            <SectionBar />
            <DeviceList />
            <Pages />
          </Col>
        ) : (
          <Col>
            <SlideBar devices={actionItems} />
          </Col>
        )}
      </Row>
    </Container>
  );
});

export default Shop;
