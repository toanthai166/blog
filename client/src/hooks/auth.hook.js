import { useMutation } from "react-query";
import { useCallback, useEffect, useMemo } from "react";
import { login, register } from "../api/auth.api";
import { useAtom } from "jotai";
import { authAtom } from "../states/auth.state";

import { RESET } from "jotai/utils";

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom);
  const mutation = useMutation(login, {
    mutationKey: "login",
  });
  console.log(mutation.data);
  useEffect(() => {
    mutation.data && setAuth(mutation.data);
  }, [mutation.data, mutation.isSuccess, setAuth]);

  const handleLogin = useCallback(
    ({ email, password }) => {
      mutation.mutate({ email, password });
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
    logout,
  };
};

export const useRegister = () => {
  const [setAuth] = useAtom(authAtom);
  const mutation = useMutation(register, {
    mutationKey: "register",
  });
  useMemo(() => {
    setAuth(mutation.data ?? {});
  }, [mutation.data]);
  const handleRegister = useCallback(
    ({ email, name, password }) => {
      mutation.mutate({ email, name, password });
    },
    [mutation]
  );
  return { mutation, handleRegister };
};
