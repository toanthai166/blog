import { Row } from "antd";
import TabLeftProfile from "../../../components/tab-left-profile";

const ProfileLayout = ({ children }) => {
  return (
    <>
      <Row gutter={20} className="pt-10 w-full flex-nowrap space-x-7">
        <TabLeftProfile />
        {children}
      </Row>
    </>
  );
};

export default ProfileLayout;
