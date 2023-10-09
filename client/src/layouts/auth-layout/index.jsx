import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AuthLayout({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="w-screen h-screen min-w-[1600px] overflow-hidden">
      <div className="grid grid-cols-3">
        <div className="col-span-1 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1588467850695-a898367ce465?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEZMT1VSJTIwJTI2JTIwQlVUVEVSfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
            alt="authentication-banner"
            className="w-full h-full"
          />
        </div>
        <div className="col-span-2">
          <div className="w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
