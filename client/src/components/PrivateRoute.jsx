import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { roles } from "../ultis/role";
import { AppRoutes } from "../helpers/app-routes";
import AdminDashboard from "../screens/admin/dashboard";

const PrivateRoute = ({ role }) => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth");
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
  }, [auth, navigate, role]);

  return (
    <AdminDashboard>
      <Outlet></Outlet>
    </AdminDashboard>
  );
};

export default PrivateRoute;

PrivateRoute.defaultProps = {
  role: roles.admin,
};
