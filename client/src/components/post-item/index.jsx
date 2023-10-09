import { Divider } from "antd";
import { HeartIcon } from "../../assets";

const PostItem = () => {
  return (
    <div className="justify-center items-center flex-col gap-3 flex">
      <img
        src="https://static.wixstatic.com/media/913019_2ba11e8e307748eba718289047e31e4b~mv2.jpg/v1/fill/w_345,h_345,fp_0.50_0.50,q_90,enc_auto/913019_2ba11e8e307748eba718289047e31e4b~mv2.jpg"
        alt=""
      />
      <div className="text-xl">Super Crisp Churros </div>
      <span className="h-5 text-ellipsis overflow-hidden">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quis velit
        repellat illo similique. Provident, voluptates debitis sed deleniti,
        laboriosam molestias voluptatibus praesentium eum ab accusamus
        architecto vero maiores mollitia.
      </span>
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
