import { useState } from "react";
import ProfileLayout from "./profile-layout";
import { Button, Col, Input, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../helpers/app-routes";
import {
  useListFavorite,
  useRemoveToListBlog,
} from "../../../hooks/listFavorite.hook";

const FavoriteBlog = ({ id }) => {
  const navigate = useNavigate();
  const [idsSelected, setIdsSelected] = useState([]);
  const { handleRemoveToListBlog, mutation } = useRemoveToListBlog();

  const [checkInputAll, setCheckInputAll] = useState();
  const { listBlog } = useListFavorite(id);

  // thêm id vào mảng
  const handleChangeInput = (e) => {
    const { value, checked } = e.target;

    if (checked === true && !idsSelected.includes(value)) {
      setIdsSelected([...idsSelected, value]);
    }
    if (checked === false) {
      const newArr = idsSelected.filter((id) => id !== value);
      setIdsSelected(newArr);
      if (newArr.length === 0) {
        setCheckInputAll(false);
      }
    }
  };

  const handleListIdFavoriteProduct = (e) => {
    if (e.target.checked === true) {
      setCheckInputAll(true);
      setIdsSelected(listBlog[0]?.items.map((item) => item.id));
    } else {
      setCheckInputAll(false);
      setIdsSelected([]);
    }
  };

  const handleRemoveFavoritePoduct = async () => {
    for (let i = 0; i < idsSelected.length; i++) {
      //
      handleRemoveToListBlog({ blogId: idsSelected[i] });
    }
    setCheckInputAll(false);
    setIdsSelected([]);
  };
  const columns = [
    {
      title: "",
      dataIndex: "",
      key: "",
      render: (item) => {
        return (
          <div className="full h-[90px] flex  gap-3">
            <img
              className="w-[90px] h-[90px] object-cover relative hover:cursor-pointer"
              src={item?.image ?? ""}
              alt="Ảnh đại diện"
              onClick={() => navigate(AppRoutes.postDetailId(item?._id))}
            />
            <h2
              className="w-[80%] text-lg h-[90px] text-ellipsis overflow-hidden font-semibold hover:cursor-pointer"
              onClick={() => navigate(AppRoutes.postDetailId(item?._id))}
            >
              {item.title}
            </h2>
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      width: 50,
      render: (item) => {
        return (
          <Input
            value={item._id}
            className="w-5 h-5 hover:cursor-pointer"
            checked={!!idsSelected.some((it) => it === item._id)}
            onChange={(e) => handleChangeInput(e)}
            type="checkbox"
          />
        );
      },
    },
  ];
  return (
    <>
      <ProfileLayout>
        <Col className="flex-grow space-y-3 mb-[60px]">
          <div className="bg-white py-3 px-5 flex justify-between items-center">
            <h2 className="font-semibold text-[16px]">Danh sách yêu thích</h2>
            <div className="flex gap-2">
              <label
                htmlFor="checked-all"
                className="text-sm font-semibold hover:cursor-pointer"
              >
                Tất cả
              </label>
              <Input
                id="checked-all"
                checked={checkInputAll}
                className="w-5 h-5 hover:cursor-pointer"
                type="checkbox"
                onChange={(e) => handleListIdFavoriteProduct(e)}
              />
            </div>
          </div>
          <div className="  bg-white p-5 ">
            <Table
              size="middle"
              columns={columns}
              dataSource={listBlog[0]?.items}
            />
          </div>
          <div className="  flex items-center justify-end gap-x-20px px-24px py-[10px] bg-white w-full">
            <Button
              disabled={
                !idsSelected || (idsSelected && idsSelected.length === 0)
              }
              type="primary"
              onClick={handleRemoveFavoritePoduct}
            >
              Bỏ thích
            </Button>
          </div>
        </Col>
      </ProfileLayout>
    </>
  );
};

export default FavoriteBlog;
