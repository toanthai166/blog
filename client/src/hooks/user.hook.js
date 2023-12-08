import { useMutation, useQuery, useQueryClient } from "react-query";

import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../helpers/app-routes";
import { getUserById, updateProfile } from "../api/user.api";
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
