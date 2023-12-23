import { Spin, Tabs } from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";

import { AppRoutes } from "../../../helpers/app-routes";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const dataEmpty = [
  {
    date: "",
    revenue: 102000,
  },
];

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
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();

  const [tabActive, setTabActive] = useState("true");
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
    isActive: true,
  });

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
    <>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Mã giảm giá", to: null },
        ]}
      />
      <div className="item-banner px-5">
        <Tabs items={tabs} activeKey={tabActive} onChange={handleChangeTab} />
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          width={600}
          height={250}
          data={dataEmpty}
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
    </>
  );
};

export default RevenueManagement;
