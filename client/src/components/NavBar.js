import React, { useContext, useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { Context } from "..";
import {
  ARTICLE_ROUTE,
  CART_ROUTE,
  DEVICE_ROUTE,
  LOGIN_ROUTE,
  ORDERS_ROUTE,
  SHOP_ROUTE,
} from "../utils/consts";
import { Form, Image, ListGroup, NavDropdown, Overlay } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTE } from "./../utils/consts";
import {
  FaShoppingCart,
  FaUser,
  FaUserSlash,
  FaCog,
  FaMoneyBill,
} from "react-icons/fa";

import { fetchOrders } from "../http/orderAPI";
import { fetchSections, searchDevice } from "../http/deviceAPI";

const NavBar = observer(() => {
  const { user, order, device, info } = useContext(Context); //Получаем контекст. В зависимости от того, зарегистрирован юзер или нет, навбар будет отображаться по разному
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const expand = "lg";

  useEffect(() => {
    if (user.isAuth && user.user.role === "ADMIN")
      fetchOrders().then((data) => order.setReceiveOrder(data));
  }, [user]);

  useEffect(() => {
    if (user.isAuth && user.user.role === "ADMIN") getOrders();
  }, []);

  useEffect(() => {
    searchDevice(searchInput).then((data) => {
      setSearchResult(data);
    });
  }, [searchInput]);

  const getOrders = () => {
    fetchOrders().then((data) => order.setReceiveOrder(data));
  };

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    sessionStorage.removeItem("token");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  return (
    <Navbar
      className="shadow-box1 navbar-menu border-bottom border-secondary border-2"
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
    >
      <Container>
        <div className="d-flex  align-items-center">
          <div
            style={{ width: "50px", height: "50px" }}
            className="mx-1 d-inline-block"
          >
            <Image
              style={{
                cursor: "pointer",
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              src={process.env.REACT_APP_API_URL + "images/" + info.logo}
              onClick={() => navigate(SHOP_ROUTE)}
            />
          </div>

          <Navbar.Brand href={SHOP_ROUTE}>{info.siteName}</Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="justify-content-end flex-grow-1 pe-3">
            {info.articles.map(
              (el) =>
                el.show_menu && (
                  <Nav.Link
                    style={{ whiteSpace: "pre" }}
                    key={el.id}
                    href="#"
                    onClick={() => navigate(ARTICLE_ROUTE + "/" + el.id)}
                  >
                    {el.title}
                  </Nav.Link>
                )
            )}

            <NavDropdown
              title="Категорії"
              id={`offcanvasNavbarDropdown-expand-${expand}`}
            >
              {device.categories.map((category) => (
                <NavDropdown.Item
                  href="#"
                  key={category.id}
                  onClick={() => {
                    device.setSelectedCategory(category);
                    fetchSections(category.id).then((data) => {
                      device.setSections(data);
                      if (data[0]) device.setSelectedSection(data[0]); //устанавливаем в выбранную первый раздел
                    });
                    navigate(SHOP_ROUTE);
                  }}
                >
                  {category.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          <Form
            className="d-flex search"
            ref={target}
            onFocus={() => setShow(true)}
            onBlur={() => setShow(false)}
          >
            <Form.Control
              value={searchInput}
              type="search"
              placeholder="Я шукаю"
              className="me-2"
              aria-label="Search"
              onChange={handleSearch}
            />
          </Form>
          <Overlay target={target.current} show={show} placement="bottom">
            {({
              placement: _placement,
              arrowProps: _arrowProps,
              show: _show,
              popper: _popper,
              hasDoneInitialMeasure: _hasDoneInitialMeasure,
              ...props
            }) => (
              <div
                {...props}
                style={{
                  position: "absolute",
                  backgroundColor: "rgba(200, 200, 200, 0.9)",
                  padding: "2px 10px",
                  color: "gray",
                  borderRadius: 3,
                  ...props.style,
                }}
              >
                <ListGroup className="mb-2">
                  {searchResult.map((el) => (
                    <ListGroup.Item style={{ cursor: "pointer" }} key={el.id}>
                      <div
                        onClick={() => {
                          navigate(DEVICE_ROUTE + "/" + el.id);
                        }}
                      >
                        {el.name}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </Overlay>
          {user.isAuth && user.user.role === "ADMIN" && (
            <Nav className="flex-row text-white">
              <div
                onClick={() => {
                  navigate(ORDERS_ROUTE);
                }}
              >
                <div
                  style={{ width: "30px", height: "30px" }}
                  className="position-relative orders"
                >
                  {
                    <FaMoneyBill className="shop-cart-button mx-2 position-absolute" />
                  }
                  <div
                    style={{ left: "15px", top: "-8px", fontSize: "1.3em" }}
                    className="position-absolute"
                  >
                    {order.receiveOrders.length}
                  </div>
                </div>
              </div>
              <div
                className="mx-4 mx-lg-0 text-warning"
                onClick={() => {
                  navigate(ADMIN_ROUTE);
                }}
              >
                <FaCog className="shop-cart-button mx-2" />
              </div>
            </Nav>
          )}
        </Navbar.Collapse>

        {user.isAuth && (
          <Nav
            className="d-flex text-light flex-row"
            style={{ color: "white" }}
          >
            <div style={{ fontSize: "0.8em", maxWidth: "140px" }}>
              Вітаємо, <br /> {user.user.email}!
            </div>
            <FaUserSlash
              onClick={() => logOut()}
              className="shop-cart-button mx-2"
            />
            <div
              style={{ width: "30px", height: "30px" }}
              className=" position-relative"
            >
              <FaShoppingCart
                className={`position-absolute shop-cart-button mx-2 ${
                  order.cartIsOpen && "active"
                }`}
                onClick={() => {
                  order.setCartIsOpen(!order.cartIsOpen);
                  order.cartIsOpen
                    ? navigate(CART_ROUTE)
                    : navigate(SHOP_ROUTE);
                }}
              />
              <span
                style={{ top: "-40%", left: "46%" }}
                className="fw-bold fs-5   position-absolute"
              >
                {order.order.length}
              </span>
            </div>
          </Nav>
        )}
        {!user.isAuth && (
          <Nav className="" style={{ color: "white" }}>
            <FaUser
              onClick={() => navigate(LOGIN_ROUTE)}
              className="shop-cart-button mx-sm-4"
            />
          </Nav>
        )}
      </Container>
    </Navbar>
  );
});

export default NavBar;
