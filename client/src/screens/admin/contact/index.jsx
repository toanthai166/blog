import { Spin, Table, Tag, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../helpers/app-routes";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { DefaultPagination } from "../../../ultis/pagination";
import { useState } from "react";
import { useContact } from "../../../hooks/contact.hook";

const ContactManagement = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
  });
  const { contacts, isLoading } = useContact({ ...filter });

  const listContact = contacts?.results
    ? contacts?.results?.map((item, index) => ({
        ...item,
        key: item.id,
        index: ++index,
      }))
    : [];

  const onChangePage = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      render: (fullname) => <span>{fullname}</span>,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (content) => <span>{content}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (answer) => {
        switch (answer) {
          case "done":
            return <>đã xử lý</>;
          case "waiting":
            return <>chưa xử lý</>;
          default:
            break;
        }
      },
    },

    {
      title: "Action",
      key: "id",
      dataIndex: "id",
      render: (id) => {
        return (
          <div className="flex gap-2 justify-center">
            <Tooltip title="Xem chi tiết">
              <Tag
                className="hover:cursor-pointer"
                color="gold"
                onClick={() => navigate(AppRoutes.contactDetailId(id))}
              >
                <EyeOutlined />
              </Tag>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Liên hệ", to: AppRoutes.blog },
        ]}
      />
      <div className="bg-white mx-5 mt-5">
        <h2 className="text-lg font-semibold p-5">
          {contacts?.totalResults} liên hệ tất cả
        </h2>
        <Table
          size="small"
          className="p-5"
          bordered
          columns={columns}
          dataSource={listContact}
          pagination={{
            ...DefaultPagination,
            onChange: onChangePage,
            current: Number(filter?.page),
            total: contacts?.totalResults,
          }}
          scroll={{ y: "calc(100vh - 320px)" }}
        />
      </div>
      <div></div>
    </Spin>
  );
};

export default ContactManagement;
