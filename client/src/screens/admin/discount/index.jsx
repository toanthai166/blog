import {
  Button,
  Divider,
  Popconfirm,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import {
  EyeOutlined,
  PoweroffOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { AppRoutes } from "../../../helpers/app-routes";
import { useState } from "react";
import { DefaultPagination, numberWithDots } from "../../../ultis/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  useChangeIsActiveDiscount,
  useDiscount,
} from "../../../hooks/discount.hook";

export const FORMAT_TIME = "DD/MM/YYYY HH:mm";

const DiscountManagement = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();

  const [tabActive, setTabActive] = useState("true");
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
    isActive: true,
  });
  const { discounts, isLoading } = useDiscount({ ...filter });

  const listDiscount = discounts?.results
    ? discounts?.results?.map((item, index) => ({
        ...item,
        key: item.id,
        index: ++index,
      }))
    : [];

  const { handleChangeIsActiveDiscount, mutation } =
    useChangeIsActiveDiscount();

  const onChangePage = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };

  const tabs = [
    {
      key: "true",
      label: `Đang hoạt động`,
    },
    {
      key: "false",
      label: `Đã kết thúc`,
    },
  ];

  const defaultColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên chương trình",
      dataIndex: "name",
      key: "name",
      render: (name) => <span>{name}</span>,
    },
    {
      title: "Thời gian",
      dataIndex: "startDate",
      key: "startDate",
      width: "20%",
      render(value, record) {
        console.log("record", record.endDate);
        console.log("dayjs(value)", dayjs(value).format(FORMAT_TIME));
        return (
          dayjs(value).format(FORMAT_TIME) +
          " - " +
          dayjs(record.endDate).format(FORMAT_TIME)
        );
      },
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "limit",
      key: "limit",
    },
    {
      title: "Đơn tối thiểu",
      key: "minOrderValue",
      dataIndex: "minOrderValue",
      align: "center",
      render: (minOrderValue) => numberWithDots(minOrderValue) + " đ",
    },
    {
      title: "Mức giảm",
      dataIndex: "value",
      align: "center",
      key: "value",
      render: (value, record) => (
        <span className="text-error">
          {numberWithDots(value) + " " + (record?.unit === "VND" ? " đ" : " %")}
        </span>
      ),
    },
    {
      title: "Đã dùng",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render(_value, record) {
        const startDate = record?.startDate;
        const endDate = record?.endDate;
        if (dayjs(endDate).isBefore(dayjs())) {
          return <span className="text-grayscale-disabled">Đã kết thúc</span>;
        }
        if (dayjs(startDate).isAfter(dayjs())) {
          return <span className="text-blue">Sắp diễn ra</span>;
        }
        return <span className="text-[#1BB045]">Đang diễn ra</span>;
      },
    },
    {
      title: "Tùy chọn",
      dataIndex: "id",
      key: "action",
      align: "center",
      width: 200,
      render(id, record) {
        const startDate = record?.startDate;
        const endDate = record?.endDate;

        if (dayjs(endDate).isBefore(dayjs())) {
          return (
            <Tooltip title="Xem chi tiết">
              <Tag
                className="hover:cursor-pointer"
                color="gold"
                onClick={() => navigate(AppRoutes.promotions.detailId(id))}
              >
                <EyeOutlined />
              </Tag>
            </Tooltip>
          );
        }
        return (
          <div className="flex gap-2">
            <Tooltip title="Xem chi tiết">
              <Tag
                className="hover:cursor-pointer"
                color="gold"
                onClick={() => navigate(AppRoutes.promotions.detailId(id))}
              >
                <EyeOutlined />
              </Tag>
            </Tooltip>
            <Divider type="vertical" />
            {dayjs(startDate).isAfter(dayjs()) ? (
              <Tooltip title="Xóa">
                <Tag
                  className="hover:cursor-pointer"
                  color="#f50"
                  // onClick={() =>
                  //   showDialog({
                  //     content: record?.name,
                  //     title: `Bạn có chắc chắn muốn xóa chương trình khuyến mại này không?`,
                  //     confirmText: "Xóa",
                  //     onOK: () => handleRemoveDiscount(record?.id),
                  //   })
                  // }
                >
                  <DeleteOutlined />
                </Tag>
              </Tooltip>
            ) : (
              <div className="">
                <Popconfirm
                  title="Kết thúc"
                  okButtonProps={{ disabled: mutation.isLoading }}
                  onConfirm={() => {
                    handleChangeIsActiveDiscount({
                      id: id,
                      isActive: false,
                    });
                  }}
                  description="Bạn chắc chắn muốn kết thúc chương trình khuyến mãi này?"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                >
                  <Tooltip title="Kết thúc">
                    <Tag className="hover:cursor-pointer" color="#f50">
                      <PoweroffOutlined />
                    </Tag>
                  </Tooltip>
                </Popconfirm>
              </div>
            )}
            <Divider type="vertical" />
            <Tooltip title="Sửa">
              <Tag
                className="hover:cursor-pointer"
                color="#2db7f5"
                onClick={() => navigate(AppRoutes.promotions.editId(id))}
              >
                <EditOutlined />
              </Tag>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleChangeTab = (key) => {
    setParams((p) => {
      p.set("isActive", key);
      return p;
    });
    setTabActive(key);
    console.log(key);
    setFilter({ ...filter, isActive: key, page: 1 });
  };

  return (
    <Spin spinning={isLoading}>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Mã giảm giá", to: null },
        ]}
        rightContent={
          <Button
            type="default"
            onClick={() => {
              navigate(AppRoutes.createDiscount);
            }}
          >
            Thêm mới khuyến mãi
          </Button>
        }
      />
      <Tabs items={tabs} activeKey={tabActive} onChange={handleChangeTab} />

      <div className="bg-white mx-5 mt-5">
        <Table
          size="small"
          bordered
          columns={defaultColumns}
          dataSource={listDiscount}
          pagination={{
            ...DefaultPagination,
            onChange: onChangePage,
            current: Number(filter?.page),
            total: listDiscount?.totalResults,
          }}
          scroll={{ y: "calc(100vh - 320px)" }}
        />
      </div>
      <div></div>
    </Spin>
  );
};

export default DiscountManagement;
