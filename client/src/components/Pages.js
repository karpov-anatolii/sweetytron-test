import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Pagination } from "react-bootstrap";
import { Context } from "..";

const Pages = observer(() => {
  const { device } = useContext(Context);
  const pageCount = Math.ceil(device.totalCount / device.limit);
  console.log("pageCount=" + pageCount);
  console.log("device.totalCount=" + device.totalCount);
  console.log("device.limit=" + device.limit);
  const pages = [];

  for (let i = 1; i <= pageCount; i++) {
    pages.push(
      <Pagination.Item
        key={i}
        active={i === device.page}
        onClick={() => {
          device.setPage(i);
        }}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <Pagination className="d-flex justify-content-center">{pages}</Pagination>
  );
});

export default Pages;
