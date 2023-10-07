import React, { useEffect, useState } from "react";
import { fetchSlideShow } from "../http/deviceAPI";
import { Badge, Card, Carousel, Col } from "react-bootstrap";

const SlideShow = () => {
  const [slideData, setSlideData] = useState([]);

  useEffect(() => {
    fetchSlideShow().then((data) => {
      setSlideData(data);
    });
  }, []);

  return (
    <Col className="w-100 my-3">
      <Carousel>
        {slideData.map(
          (slide, index) =>
            slide.show && (
              <Carousel.Item key={slide.id} className="carousel-main">
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="d-block w-100"
                  src={process.env.REACT_APP_API_URL + "images/" + slide.img}
                  alt={`${index + 1} slide`}
                />
                <Carousel.Caption>
                  <Badge
                    bg="dark"
                    className={
                      (slide.title || slide.text ? `visible` : `invisible`) +
                      ` bg-opacity-50 text-wrap`
                    }
                  >
                    <div className="slideshow-title">{slide.title}</div>
                    <div className="slideshow-text">{slide.text}</div>
                  </Badge>
                </Carousel.Caption>
              </Carousel.Item>
            )
        )}
      </Carousel>
    </Col>
  );
};

export default SlideShow;
