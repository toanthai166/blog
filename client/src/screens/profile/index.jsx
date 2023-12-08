import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MyAddress from "./component/address";
import MyOrder from "./component/myOrder";

const Profile = () => {
  const [searchParams] = useSearchParams();

  const [tabs, setTabs] = useState("");
  const userId = JSON.parse(localStorage.getItem("auth"))?.data?.user.id;

  useEffect(() => {
    const res = searchParams.get("info");
    switch (res) {
      case "myOrder":
      default:
        setTabs("myOrder");
        break;
      case "address":
        setTabs("address");
        break;
    }
  }, [searchParams]);

  return (
    <div>
      {tabs === "myOrder" && <MyOrder id={userId} />}
      {tabs === "address" && <MyAddress id={userId} />}
    </div>
  );
};

export default Profile;
