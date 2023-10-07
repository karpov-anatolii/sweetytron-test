import React, { useContext, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "..";

const ArticlePage = observer((props) => {
  const { id } = useParams();
  const { info } = useContext(Context);

  return (
    <Container className="p-4" style={{ minHeight: window.innerHeight - 232 }}>
      <Row className="m-4 d-block text-center fw-bold fs-2">
        {info.articles.filter((el) => el.id == id)[0].title}
      </Row>
      <Row style={{ whiteSpace: "pre-wrap" }} className="m-3 fs-4">
        {info.articles.filter((el) => el.id == id)[0].content}
      </Row>
    </Container>
  );
});

export default ArticlePage;
