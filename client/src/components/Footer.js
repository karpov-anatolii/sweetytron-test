import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";

import { NavLink } from "react-router-dom";
import { Context } from "..";
import { ARTICLE_ROUTE } from "../utils/consts";
import { Button, Nav, Navbar } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaUserSlash } from "react-icons/fa";
import { SITE_NAME } from "./../utils/consts";

const Footer = observer(() => {
  const { info } = useContext(Context);
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        className="nav p-0 shadow-box1 footer border-top border-secondary border-2"
      >
        <Container className="p-0 d-block position-relative">
          <div className="logo-footer">
            <p>{info.siteName}</p>
          </div>
          <Nav className="my-1 mt-3  px-4 footer-content d-flex justify-content-center ">
            {info.articles.map(
              (el) =>
                el.show_footer && (
                  <Nav.Link
                    key={el.id}
                    href="#"
                    onClick={() => navigate(ARTICLE_ROUTE + "/" + el.id)}
                  >
                    {el.title}
                  </Nav.Link>
                )
            )}
          </Nav>
          <div className="fs-5 my-2 footer-content text-secondary text-center">
            {info.masterPhone}
          </div>
          <div className="mb-5  my-3  px-0 footer-content text-secondary text-center">
            &copy;{new Date().getFullYear()} {info.siteName} Всі права захищені.{" "}
          </div>
        </Container>
      </Navbar>
    </>
  );
});

export default Footer;
