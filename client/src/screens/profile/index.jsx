import Lable from "../../components/lable";

const Profile = () => {
  return (
    <>
      <Lable title="About Me"> </Lable>{" "}
      <div className="flex w-[70%] mx-20 justify-end mt-20 relative">
        <div className="-mr-6 bg-neutral-100 absolute left-[15%] top-1/2 -translate-y-1/2  w-[500px] flex flex-col gap-5 p-10">
          <span className="text-4xl font-normal">
            Sugar, Spice and Everything Nice
          </span>
          <span>
            Hi, Mia a paragraph. Click here to add your own text and edit me.
            It’s easy. Just click “Edit Text” or double click me to add your own
            content and make changes to the font. I’m a great place for you to
            tell a story and let your users know a little more about you.
          </span>
          <span>
            Hi, Mia a paragraph. Click here to add your own text and edit me.
            It’s easy. Just click “Edit Text” or double click me to add your own
            content and make changes to the font. I’m a great place for you to
            tell a story and let your users know a little more about you.
          </span>
        </div>
        <img
          className="h-[720px] max-w-[512px] object-cover"
          src="https://static.wixstatic.com/media/913019_c99ac15f613340469971e40dee3c1476~mv2.jpg/v1/fill/w_839,h_677,al_t,q_85,usm_0.66_1.00_0.01,enc_auto/913019_c99ac15f613340469971e40dee3c1476~mv2.jpg"
          alt=""
        />
      </div>
    </>
  );
};

export default Profile;
