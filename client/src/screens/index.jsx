import { Suspense, lazy } from "react";

// import { ProgressLoading } from "../components";

const LazyLayout = (importStatement) => {
  const Component = lazy(importStatement);

  return (
    <Suspense fallback={<></>}>
      <Component />
    </Suspense>
  );
};

export const Home = () => LazyLayout(() => import("./home"));
export const Login = () => LazyLayout(() => import("./login"));
export const Register = () => LazyLayout(() => import("./register"));
export const Faq = () => LazyLayout(() => import("./faq"));
export const Profile = () => LazyLayout(() => import("./profile"));
