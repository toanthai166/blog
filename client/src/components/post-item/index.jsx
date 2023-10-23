import { Divider } from "antd";
import { HeartIcon } from "../../assets";

const PostItem = ({ it }) => {
  return (
    <div className="justify-center items-center flex-col gap-3 flex">
      <img src={it?.image} alt="" className="rounded-lg" />
      <div className="text-xl">{it?.title}</div>
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
