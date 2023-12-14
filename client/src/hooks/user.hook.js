import { useMutation, useQuery, useQueryClient } from "react-query";

import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../helpers/app-routes";
import {
  changeIsActiveUser,
  getUserById,
  getUsers,
  updateProfile,
} from "../api/user.api";
import { useAtom } from "jotai";
import { listUser } from "../states/user.state";

export const useGetUserById = (id) => {
  const [user, setUser] = useAtom(listUser);
  const { isLoading, error } = useQuery({
    queryKey: [`user`],
    queryFn: () => getUserById(id),
    enabled: id ? true : false,
    onSuccess: (res) => {
      setUser(res.data);
    },
  });
  return { isLoading, error, user };
};
export const useUser = (filter) => {
  const [users, setUsers] = useAtom(listUser);
  const { isLoading, error } = useQuery({
    queryKey: [`user/${filter.page}&&${filter.title}`],
    queryFn: () => getUsers(filter),
    onSuccess: (res) => {
      setUsers(res.data);
    },
  });
  return { isLoading, error, users };
};

export const useChangeIsActiveUser = (filter) => {
  const mutation = useMutation(changeIsActiveUser, {
    mutationKey: [`users/active`],
  });
  const client = useQueryClient();
  const handleChangeIsActiveUser = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        client.invalidateQueries(`user/${filter.page}&&${filter.title}`);
        notification.success({
          message: "Cập nhật trạng thái thành công",
        });
      },
    });
  };
  return {
    mutation,
    handleChangeIsActiveUser,
  };
};
export const useUpdateUser = (id) => {
  const mutation = useMutation(updateProfile, {
    mutationKey: [`user/${id}`],
  });
  const client = useQueryClient();
  const handleUpdateProfile = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        client.invalidateQueries("user");
        notification.success({
          message: "Sửa thông tin thành công",
        });
      },
    });
  };
  return {
    mutation,
    handleUpdateProfile,
  };
};
