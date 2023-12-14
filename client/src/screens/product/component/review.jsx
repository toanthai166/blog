import { Avatar, Pagination, Rate, Tabs } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

import { useReview } from "../../../hooks/review.hook";
import { ReviewEmpty } from "../../../assets";
import dayjs from "dayjs";
import { FORMAT_TIME } from "../../admin/order";
export const tabStar = {
  all: 0,
  five: 5,
  four: 4,
  three: 3,
  two: 2,
  one: 1,
};

export const ProductReview = () => {
  const { id = "" } = useParams();
  const [tabStarActive, setTabStarActive] = useState(tabStar.all);

  const [filter, setFilter] = useState({
    limit: 4,
    page: 1,
    rating: +tabStarActive,
    productId: id,
  });

  const { review } = useReview({ ...filter });
  console.log("review :>> ", review);

  // const reviews = useMemo(() => data?.reviewsOfProduct?.items, [data]);

  const handleChangeTabStar = useCallback(
    (key) => {
      setTabStarActive(key);
      setFilter({ ...filter, page: 1, rating: +key });
    },
    [filter]
  );

  const handleChangePage = useCallback(
    (newPage) => {
      setFilter({ ...filter, page: newPage });
    },
    [filter]
  );

  const itemsStar = useMemo(
    () => [
      {
        key: "0",
        label: <div className="rounded-full py-2 px-4">Tất cả</div>,
      },
      {
        key: "5",
        label: <div className="rounded-full  py-2 px-4">5 sao</div>,
      },
      {
        key: "4",
        label: <div className="rounded-full  py-2 px-4">4 sao</div>,
      },
      {
        key: "3",
        label: <div className="rounded-full  py-2 px-4">3 sao</div>,
      },
      {
        key: "2",
        label: <div className="rounded-full  py-2 px-4">2 sao</div>,
      },
      {
        key: "1",
        label: <div className="rounded-full  py-2 px-4">1 sao</div>,
      },
    ],
    []
  );

  return (
    <>
      <div className="mb-5 item-banner bg-white p-2">
        <Tabs
          activeKey={tabStarActive}
          animated={{ inkBar: false, tabPane: false }}
          items={itemsStar}
          onChange={handleChangeTabStar}
        />
      </div>

      <div className="">
        <div className="">
          {review && review.results.length > 0 ? (
            (review.results ?? []).map((review) => (
              <div
                className="p-5 flex flex-col gap-4 bg-white"
                key={review?.id}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-row items-center break-words">
                    <Avatar
                      style={{ backgroundColor: "#b4755e" }}
                      icon={<UserOutlined />}
                    />
                    <div
                      className="ml-[12px]"
                      style={{ maxWidth: "calc(100% - 32px - 12px)" }}
                    >
                      <div className="font-medium text-[14px] leading-[20px] text-yankees-blue whitespace-nowrap text-ellipsis overflow-hidden">
                        {review?.user?.name}
                      </div>
                      <div>{dayjs(review.createdAt).format(FORMAT_TIME)} </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{ borderLeft: "1px solid #EEEEEE" }}
                  className="pl-4  flex flex-col gap-2 "
                >
                  <span>
                    <Rate disabled value={review?.rating} />
                  </span>
                  <span>{review?.comment}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-20px flex flex-col justify-center items-center">
              <ReviewEmpty />
              <div className="text-14px text-grayscale-gray leading-20px">
                Chưa có Đánh giá nào
              </div>
            </div>
          )}
          <div className="flex justify-end custome-pagination mt-5">
            <Pagination
              current={filter?.page}
              onChange={handleChangePage}
              total={review?.totalResults}
              pageSize={filter?.limit}
            />
          </div>
        </div>
      </div>
    </>
  );
};
