import { Divider } from "antd";
import { HeartIcon } from "../../assets";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";
import dayjs from "dayjs";

const itItem = ({ it, className }) => {
  console.log("it", it);
  return (
    <Link
      to={AppRoutes.postDetailId(it?.id)}
      className={`banneritem  w-full relative `}
    >
      <div>
        <img
          src={it?.image}
          alt=""
          className={`w-full ${className} object-cover hover:opacity-95 transition-all`}
        />
      </div>
      <div className="banner-content flex flex-col absolute bottom-0 bg-[rgba(0,0,0,0.2)] text-white w-full px-10 py-3 h-[116px]">
        <span className=" bg-yellow-200 p-0 rounded max-w-[80px] text-slate-900 text-sm font-medium  w-full text-center mb-2">
          {it?.category?.name}
        </span>
        <span className="text-lg font-medium mb-3 hover:underline">
          <span className="line-clamp-1">{it?.title}</span>
        </span>
        <div className="flex justify-start  bottom-0 text-slate-500 text-xs  gap-1 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className=" text-xs text-white  ">
            {dayjs(it?.createdAt).format("DD/MM/YYYY")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default itItem;
