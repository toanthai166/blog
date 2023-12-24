import { useMutation } from "react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { login, logout, register } from "../api/auth.api";
import { useAtom } from "jotai";
import { authAtom } from "../states/auth.state";

import { RESET } from "jotai/utils";
import { notification } from "antd";

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom);
  const [error, setError] = useState();
  const mutation = useMutation(login, {
    mutationKey: "login",
  });
  useEffect(() => {
    mutation.data && setAuth(mutation.data);
  }, [mutation.data, mutation.isSuccess, setAuth]);

  const handleLogin = useCallback(
    ({ email, password }) => {
      mutation.mutate(
        { email, password },
        { onError: (err) => setError(err.response.data.message) }
      );
    },
    [mutation]
  );
  const logout = () => {
    setAuth(RESET);
  };
  return {
    login,
    mutation,
    handleLogin,
    auth,
    error,
    logout,
  };
};

export const useRegister = () => {
  const [setAuth] = useAtom(authAtom);
  const mutation = useMutation(register, {
    mutationKey: "register",
  });
  // useMemo(() => {
  //   setAuth(mutation.data ?? {});
  // }, [mutation.data]);
  const handleRegister = useCallback(
    ({ email, name, password }) => {
      mutation.mutate(
        { email, name, password },
        {
          onSuccess: () => {
            notification.success({
              message: "Đăng kí tài khoản thành công",
            });
          },
        },
        {
          onError: (err) => {
            console.log(err);
          },
        }
      );
    },
    [mutation]
  );
  return { mutation, handleRegister };
};

export const useLogout = () => {
  const mutation = useMutation(logout, {
    mutationKey: "logout",
  });
  // useMemo(() => {
  //   setAuth(mutation.data ?? {});
  // }, [mutation.data]);
  const handleLogout = useCallback(
    (data) => {
      console.log("data :>> ", data);
      mutation.mutate(
        data,
        {
          onError: (err) => {
            console.log(err);
          },
        },
        {
          onSuccess: () => {
            notification.success({
              message: "Đăng xuất thành công",
            });
          },
        }
      );
    },
    [mutation]
  );
  return { mutation, handleLogout };
};
