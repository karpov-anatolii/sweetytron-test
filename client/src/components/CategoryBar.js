import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Container,  Nav, Navbar } from "react-bootstrap";
import { Context } from "..";
import { fetchSections } from "../http/deviceAPI";

const CategoryBar = observer(() => {
  const { device } = useContext(Context);

  return (
    <>
      <Navbar bg="dark" variant="dark" className="categories">
        <Container>
          <Nav className="me-auto flex-wrap">
            {device.categories.map((category) => (
              <Nav.Link
                href="#"
                key={category.id}
                active={
                  device.selectedCategory
                    ? category.id === device.selectedCategory.id
                    : false
                }
                onClick={() => {
                  device.setSelectedCategory(category);
                  fetchSections(category.id).then((data) => {
                    device.setSections(data);
                    if (data[0]) {
                      device.setSelectedSection(data[0]);
                    }
                  });
                }}
              >
                {category.name}
              </Nav.Link>
            ))}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
});

export default CategoryBar;
