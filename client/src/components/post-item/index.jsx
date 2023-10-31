import { Divider } from "antd";
import { HeartIcon } from "../../assets";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";

const PostItem = ({ it }) => {
  return (
    <div className="justify-center items-center flex-col gap-3 flex">
      <img
        src={it?.image}
        alt=""
        className="rounded-lg w-full h-full max-h-[205px]"
      />
      <Link
        to={AppRoutes.postDetailId(it?.id)}
        className="text-xl line-clamp-2"
      >
        {it?.title}
      </Link>
      <Divider plain />
      <div className="flex justify-between w-full">
        <div>fdf</div>
        <div>
          <HeartIcon />
        </div>
      </div>
    </div>
  );
};

export default PostItem;
