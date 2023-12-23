import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { AppRoutes } from "../helpers/app-routes";
import { listAddress } from "../states/address.state";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../api/address.api";

export const useAddress = (userId) => {
  console.log("userId :>> ", userId);
  const [addresses, setAddresses] = useAtom(listAddress);
  const { isLoading, error } = useQuery({
    queryKey: ["addresses"],
    queryFn: useCallback(() => getAddresses(userId), [userId]),
    onSuccess: (res) => {
      console.log("res?.data.results :>> ", res?.data.results);
      setAddresses(res?.data.results);
    },
  });
  return { isLoading, error, addresses };
};

export const useCreateAddress = (setIsModalOpen) => {
  const navigate = useNavigate();
  const mutation = useMutation(createAddress, {
    mutationKey: "address/create",
  });
  const client = useQueryClient();
  const handleCreateAddress = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("addresses");
          notification.success({
            message: "Thêm địa chỉ thành công",
          });
          setIsModalOpen(false);
        },
        onError: () => {
          notification.error({
            message: "Thêm địa chỉ thất bại",
          });
          navigate(AppRoutes.myAddress);
        },
      });
    },
    [client, mutation, navigate, setIsModalOpen]
  );
  return { mutation, handleCreateAddress };
};

export const useUpdateAddress = () => {
  const navigate = useNavigate();
  const mutation = useMutation(updateAddress, {
    mutationKey: [`updateaddress`],
  });
  const client = useQueryClient();
  const handleUpdateAddress = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("addresses");
          notification.success({
            message: "Sửa địa chỉ thành công",
          });
          // navigate(AppRoutes.myAddress);
        },
      });
    },
    [client, mutation, navigate]
  );
  return {
    mutation,
    handleUpdateAddress,
  };
};

export const useDeleteAddress = () => {
  const mutation = useMutation(deleteAddress, {
    mutationKey: "deleteAddress",
  });
  const client = useQueryClient();
  const handleDeleteAddress = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("addresses");
          notification.success({
            message: "Xóa địa chỉ thành công",
          });
        },
        onError: () => {
          client.invalidateQueries("faqs");
          notification.error({
            message: "Xóa địa chỉ thất bại",
          });
        },
      });
    },
    [mutation]
  );
  return { mutation, handleDeleteAddress };
};
