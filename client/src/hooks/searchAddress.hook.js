import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { AppRoutes } from "../helpers/app-routes";
import { listAddress } from "../states/address.state";
import {
  changeIsDefaultAddress,
  createAddress,
  deleteAddress,
  getAddressById,
  updateAddress,
} from "../api/address.api";
import { listSearchAddress } from "../states/searchAddress.state";
import { getCity } from "../api/searchAddress.api";

export const useSearchAddress = () => {
  const [city, setCity] = useAtom(listSearchAddress);
  const { isLoading, error } = useQuery({
    queryKey: ["city"],
    queryFn: () => getCity(),
    onSuccess: (res) => {
      setCity(res?.data);
    },
  });
  return { isLoading, error, city };
};

export const useChangeIsDefaultAddress = () => {
  const mutation = useMutation(changeIsDefaultAddress, {
    mutationKey: [`address/default`],
  });
  const client = useQueryClient();
  const handleChangeIsDefaultAddress = useCallback(
    (data) => {
      console.log(data);
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("addresses");
          notification.success({
            message: "Thiết lập thành công",
          });
        },
        onError: () => {
          client.invalidateQueries("addresses");
          notification.error({
            message: "Thiết lập thất bại",
          });
        },
      });
    },
    [client, mutation]
  );
  return {
    mutation,
    handleChangeIsDefaultAddress,
  };
};

export const useCreateAddress = () => {
  const navigate = useNavigate();
  const mutation = useMutation(createAddress, {
    mutationKey: "address/create",
  });
  const client = useQueryClient();
  const handleCreateAddress = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("faqs");
          notification.success({
            message: "Thêm địa chỉ thành công",
          });
          navigate(AppRoutes.myAddress);
        },
        onError: () => {
          notification.error({
            message: "Thêm địa chỉ thất bại",
          });
          navigate(AppRoutes.myAddress);
        },
      });
    },
    [mutation]
  );
  return { mutation, handleCreateAddress };
};

export const useUpdateAddress = (id) => {
  const navigate = useNavigate();
  const mutation = useMutation(updateAddress, {
    mutationKey: [`address/${id}`],
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
          navigate(AppRoutes.myAddress);
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
export const useGetAddressById = (id) => {
  const [address, setAddress] = useAtom(listAddress);
  const { isLoading, error } = useQuery({
    queryKey: [`address/${id}`],
    queryFn: () => getAddressById(id),
    onSuccess: (res) => {
      setAddress(res);
    },
  });
  return { isLoading, error, address };
};
export const useDeleteAddress = () => {
  const mutation = useMutation(deleteAddress, {
    mutationKey: "deleteAddress",
  });
  const client = useQueryClient();
  const handleDeleteAddress = useCallback(
    (id) => {
      mutation.mutate(id, {
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
