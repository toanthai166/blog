import { Col, FloatButton, Pagination, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import BodyRight from "./body-right";
import { useBlog } from "../../hooks/blog.hook";
import { AppRoutes } from "../../helpers/app-routes";
import dayjs from "dayjs";
import { FORMAT_TIME } from "../admin/discount";

const Search = () => {
  const { state } = useLocation();
  const { categoryId, name } = state;
  const [filter, setFilter] = useState({
    limit: 6,
    title: "",
    page: 1,
    isActive: true,
  });
  const { blogs, isLoading } = useBlog({ ...filter, categoryId: categoryId });

  const changePagination = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };
  return (
    <Spin spinning={isLoading}>
      <div className="text-center mx-auto font-bold text-2xl">
        Danh mục - {name}
      </div>
      <div>
        <Row>
          <BodyRight />
          <Col span={17} data-aos="fade-right" className="p-6 rounded-md">
            <div className=" grid gap-[1px] bg-white p-6">
              {blogs?.results?.map((it) => (
                <div key={it.id}>
                  <div className="w-full flex gap-10 " key={it.id}>
                    <img
                      className="w-full max-w-[300px] h-full max-h-[320px] object-cover hover:rounded-lg rounded-md hover:scale-105 duration-500 transition-all"
                      src={it.image}
                      alt=""
                    />

                    <div className=" flex flex-col gap-1">
                      <Link
                        to={AppRoutes.postDetailId(it?.id)}
                        className="text-2xl text-[#a62b00] font-semibold line-clamp-1 "
                      >
                        {it.title}
                      </Link>
                      <div className="space-x-2">
                        <ClockCircleOutlined style={{ color: "#ccc" }} />
                        <span className="text-base font-medium opacity-70">
                          {dayjs(it.createdAt).format(FORMAT_TIME)}
                        </span>
                      </div>
                      <div
                        className="w-full h-[150px] overflow-hidden text-base font-normal"
                        dangerouslySetInnerHTML={{ __html: it.content }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-full h-[1px] bg-slate-300 my-6"></div>
                </div>
              ))}
              <Pagination
                defaultCurrent={1}
                defaultActiveKey={1}
                defaultPageSize={6}
                className="flex justify-end"
                total={blogs?.results?.totalResults}
                onChange={changePagination}
              />
            </div>
          </Col>
        </Row>

        <FloatButton.BackTop />
      </div>
    </Spin>
  );
};

export default Search;
