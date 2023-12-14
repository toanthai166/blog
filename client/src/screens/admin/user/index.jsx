import { Popconfirm, Spin, Switch, Table } from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";

import { AppRoutes } from "../../../helpers/app-routes";
import { useState } from "react";
import { DefaultPagination } from "../../../ultis/pagination";

import { useChangeIsActiveUser, useUser } from "../../../hooks/user.hook";

const UserManagement = () => {
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
  });
  const { users, isLoading } = useUser({ ...filter });

  const { handleChangeIsActiveUser } = useChangeIsActiveUser(filter);

  const handleChangeStatus = (row) => {
    const { id, isActive } = row;
    handleChangeIsActiveUser({ userId: id, isActive: !isActive });
  };

  const listUser = users?.results
    ? users?.results?.map((item, index) => ({
        ...item,
        key: item.id,
        index: ++index,
      }))
    : [];
  console.log("listBlog :>> ", listUser);
  const onChangePage = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "title",
      width: "40%",
      render: (text) => <span className="text-base font-medium">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "category",
      render: (text) => <span className="text-base font-medium">{text}</span>,
    },
    {
      title: "Trạng thái",
      key: "isActive",
      width: "10%",
      render: (_, it) => {
        return (
          <Popconfirm
            title={`Bạn có chắc muốn cập nhật trạng thái tài khoản ?`}
            okText="Đồng ý"
            cancelText="Huỷ bỏ"
            placement="topLeft"
            onConfirm={() => handleChangeStatus(it)}
          >
            <Switch
              checked={it?.isActive}
              disabled={_.role === "admin"}
              size="default"
            />
          </Popconfirm>
        );
      },
    },

    // {
    //   title: "Action",
    //   key: "id",
    //   dataIndex: "id",
    //   align: "center",
    //   render: (id) => {
    //     return (
    //       <div className="flex gap-2 justify-center">
    //         <Tooltip title="Sửa">
    //           <Tag
    //             className="hover:cursor-pointer"
    //             color="blue"
    //             onClick={() => navigate(AppRoutes.blogEditById(id))}
    //           >
    //             <EditOutlined />
    //           </Tag>
    //         </Tooltip>
    //         <span className="translate-y-0.5 text-grayscale-border">|</span>
    //         <Tooltip title="Xem chi tiết">
    //           <Tag
    //             className="hover:cursor-pointer"
    //             color="gold"
    //             onClick={() => navigate(AppRoutes.blogDetailId(id))}
    //           >
    //             <EyeOutlined />
    //           </Tag>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
  ];
  return (
    <Spin spinning={isLoading}>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Tài khoản", to: AppRoutes.user },
        ]}
      />
      <div className="bg-white mx-5 mt-5 rounded-lg">
        <h2 className="text-lg font-semibold p-5">
          {users?.totalResults} tài khoản
        </h2>
        <Table
          size="small"
          className="p-5"
          bordered
          columns={columns}
          dataSource={listUser}
          pagination={{
            ...DefaultPagination,
            onChange: onChangePage,
            current: Number(filter?.page),
            total: users?.totalResults,
          }}
          scroll={{ y: "calc(100vh - 320px)" }}
        />
      </div>
      <div></div>
    </Spin>
  );
};

export default UserManagement;
