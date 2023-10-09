import { Button, Divider, FloatButton } from "antd";
import {} from "../../assets";
import PostItem from "../../components/post-item";
import Layouts from "../../layouts/main-layout";

const Home = () => {
  return (
    <Layouts>
      {/* content */}
      <div>
        <div className="flex gap-5 mx-40">
          <div className="w-[980px] h-[660px] relative">
            <img
              className="w-full h-full object-cover"
              src="https://static.wixstatic.com/media/913019_3fe23cce411c49cd914d66aaeac2338d~mv2.jpg/v1/fill/w_960,h_658,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/913019_3fe23cce411c49cd914d66aaeac2338d~mv2.jpg"
              alt=""
            />{" "}
            <div className="absolute flex flex-col gap-5 items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <h2 className="text-5xl text-white">
                When Life Gives You Flour and Butter, You Better Bake
              </h2>
              <Button className="mx-auto bg-white">Tất cả bí quyết</Button>
            </div>
          </div>
          <div className="flex-1  mx-44 ">
            <PostItem />
          </div>
          <div></div>
        </div>

        {/*  */}
        <div className="flex justify-center items-center mt-10 p-14 text-3xl">
          Popular Recipes
        </div>
        <div className="w-full max-w-[900px] grid grid-cols-3 gap-5 mx-auto">
          <PostItem />
          <PostItem />
          <PostItem />
        </div>
        <div className="flex mx-40 justify-end mt-20 relative">
          <div className="-mr-6 bg-neutral-100 absolute left-[20%] w-[500px] top-1/2 -translate-y-1/2 flex flex-col gap-5 p-10">
            <span className="text-4xl font-normal">
              Sugar, Spice and Everything Nice
            </span>
            <span>
              Hi, Mia a paragraph. Click here to add your own text and edit me.
              It’s easy. Just click “Edit Text” or double click me to add your
              own content and make changes to the font. I’m a great place for
              you to tell a story and let your users know a little more about
              you.
            </span>
            <Divider plain />
            <Button block className="max-w-[100px]">
              About me
            </Button>
          </div>
          <img
            className="h-full max-h-[680px]"
            src="https://static.wixstatic.com/media/913019_c99ac15f613340469971e40dee3c1476~mv2.jpg/v1/fill/w_839,h_677,al_t,q_85,usm_0.66_1.00_0.01,enc_auto/913019_c99ac15f613340469971e40dee3c1476~mv2.jpg"
            alt=""
          />
        </div>
        <FloatButton.BackTop />
      </div>
    </Layouts>
  );
};

export default Home;
