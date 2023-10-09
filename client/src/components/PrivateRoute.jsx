import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { roles } from "../ultis/role";
import { AppRoutes } from "../helpers/app-routes";

const PrivateRoute = ({ component, role }) => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth");
  console.log(auth);
  useEffect(() => {
    if (!auth) {
      navigate(AppRoutes.login);
      return;
    }
    if (JSON.parse(auth).role === roles.user && role === roles.admin) {
      // TODO: navigate to not permissions
      console.log("run");
      return navigate(AppRoutes[404]);
    }
    const getPermission = async () => {
      //NOTE: get role here
      return;
    };
    getPermission();
  }, []);

  return component;
};

export default PrivateRoute;

PrivateRoute.defaultProps = {
  role: roles.user,
};
