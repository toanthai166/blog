import { Button, Col, DatePicker, Form, Row, Select, Table } from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";

import { AppRoutes } from "../../../helpers/app-routes";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { numberWithDots } from "../../../ultis/pagination";
import dayjs from "dayjs";
import { useReport } from "../../../hooks/revenue.hook";

const dataEmpty = [
  {
    date: "",
    revenue: 0,
  },
];

const disabledDate = (current) => {
  return current && current > dayjs();
};

const formatCurrentcy = (value) => {
  return value >= 1000000000
    ? `${(value / 1000000000).toFixed(1)} tỷ`
    : `${(value / 1000000).toFixed(1)} triệu`;
};

const CustomYAxisTick = ({ x, y, payload }) => {
  const value = payload.value;

  if (value === 0) {
    return null;
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} fontSize={12} textAnchor="end" fill="#666">
        {formatCurrentcy(value)}
      </text>
    </g>
  );
};
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-20px border border-grayscale-border shadow rounded">
        <p className="label text-primary">
          Doanh thu {label + ": " + formatCurrentcy(payload[0].value)}
        </p>
      </div>
    );
  }

  return null;
};
export const FORMAT_TIME = "DD/MM/YYYY HH:mm";

const RevenueManagement = () => {
  const [form] = Form.useForm();
  const startDate = Form.useWatch("startDate", form);
  const endDate = Form.useWatch("endDate", form);
  const time = Form.useWatch("time", form);
  const [dataChart, setDataChart] = useState();

  const [filter, setFilter] = useState({});
  const { reports } = useReport({ ...filter });
  useEffect(() => {
    setDataChart(reports?.report);
  }, [reports?.report]);
  let total = 0;
  if (reports?.report?.length > 0)
    reports?.report?.forEach((item) => {
      total += item.revenue;
    });

  const handleFilter = useCallback(
    (values) => {
      if (time) {
        setFilter({ time });
      }
      if (startDate && endDate) {
        setFilter({
          startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
          endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
        });
      }

      // setFilter({ ...filter, ...values, page: 1 });
    },
    [endDate, startDate, time]
  );

  const columnOrder = [
    {
      title: "Mã đơn hàng",
      key: "code",
      dataIndex: "id",
      width: "4%",
      render(value) {
        return value.slice(0, 7);
      },
    },
    {
      title: "Khách hàng",
      key: "user",
      dataIndex: "user",
      width: "10%",
      render(user) {
        return (
          <div>
            <p>{user?.name}</p>
            <p className="text-13px text-grayscale-gray">{user?.phone}</p>
          </div>
        );
      },
    },
    {
      title: "Thời gian",
      key: "date",
      dataIndex: "createdAt",
      width: "6%",
      align: "center",
      render(value) {
        return dayjs(value).format(FORMAT_TIME);
      },
    },
    {
      title: "Thu nhập",
      key: "total",
      dataIndex: "total",
      width: "10%",
      align: "right",
      render(value) {
        return numberWithDots(value) + " đ";
      },
    },
  ];

  return (
    <>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Thống kê", to: null },
        ]}
      />
      <div className="item-banner px-5">
        <div className="bg-white mb-5 mt-5 rounded w-full">
          <Form
            form={form}
            size="middle"
            onFinish={handleFilter}
            className="p-5 information-form-vehicle"
          >
            <Row span={24} className="space-x-5">
              <Col span={6}>
                <Form.Item name="time" label="Chọn thời gian">
                  <Select
                    options={[
                      { label: "Chọn mốc thời gian", value: null },
                      { label: "Một tuần qua", value: "weekly" },
                      { label: "Một tháng qua", value: "monthly" },
                      { label: "Một năm qua", value: "yearly" },
                    ]}
                    placeholder="Chọn thời gian"
                    disabled={startDate || endDate}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Từ ngày"
                  name="startDate"
                  disabledDate={(current) =>
                    current && current <= dayjs(startDate)
                  }
                >
                  <DatePicker
                    className="w-full h-11"
                    format={"DD/MM/YYYY"}
                    disabled={time != null}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={"Đến ngày"} name="endDate">
                  <DatePicker
                    className="w-full h-11"
                    format={"DD/MM/YYYY"}
                    disabledDate={disabledDate}
                    disabled={time != null}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  <Button type="primary" size="large" htmlType="submit">
                    Áp dụng
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <Row span={24} className="p-5 space-x-10">
        <Col span={15} className="space-y-5">
          <div className="bg-white rounded-lg p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                width={600}
                height={250}
                data={dataChart ? dataChart : dataEmpty}
                margin={{
                  left: 20,
                  right: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tick={(props) => <CustomYAxisTick {...props} />} />
                <Tooltip
                  formatter={(value) => numberWithDots(formatCurrentcy(value))}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="revenue" fill="#F5B102" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg p-5">
            <span className="text-base font-medium">
              Số lượng đơn hàng là: {reports?.orderDetails?.length} đơn
            </span>
            <Table
              size="small"
              className="p-5"
              bordered
              columns={columnOrder}
              dataSource={reports?.orderDetails}
              scroll={{ y: "calc(100vh - 320px)" }}
            />
          </div>
        </Col>
        <Col span={5}>
          <div className="flex gap-3 text-base bg-white p-5 rounded-lg">
            <span>Tổng doanh thu:</span>
            <span className="font-medium">{numberWithDots(total) + " đ"}</span>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default RevenueManagement;
