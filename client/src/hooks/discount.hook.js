import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";

import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { AppRoutes } from "../helpers/app-routes";
import {
  changeIsActiveDiscount,
  createDiscount,
  getDiscountById,
  getDiscounts,
  updateDiscount,
} from "../api/discount.api";
import { listDiscount } from "../states/discount.state";

export const useDiscount = (filter) => {
  const [discounts, setDiscounts] = useAtom(listDiscount);
  const { isLoading, error } = useQuery({
    queryKey: [`discounts?isActive=${filter.isActive}`],
    queryFn: () => getDiscounts(filter),
    onSuccess: (res) => {
      setDiscounts(res.data);
    },
  });
  return { isLoading, error, discounts };
};

export const useChangeIsActiveDiscount = () => {
  const mutation = useMutation(changeIsActiveDiscount, {
    mutationKey: [`discount/active`],
  });
  const client = useQueryClient();
  const handleChangeIsActiveDiscount = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("discounts?isActive=true");
          notification.success({
            message: "Chương trình khuyến mãi đã kết thúc",
          });
        },
        onError: () => {
          client.invalidateQueries("discounts");
          notification.error({
            message: "Thất bại",
          });
        },
      });
    },
    [client, mutation]
  );
  return {
    mutation,
    handleChangeIsActiveDiscount,
  };
};

export const useCreateDiscount = () => {
  const navigate = useNavigate();
  const mutation = useMutation(createDiscount, {
    mutationKey: "discount/create",
  });
  const client = useQueryClient();
  const handleCreateDiscount = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("faqs");
          notification.success({
            message: "Thêm mã giảm giá thành công",
          });
          navigate(AppRoutes.discountManagement);
        },
        onError: () => {
          notification.error({
            message: "Thêm mã giảm giá thất bại",
          });
          navigate(AppRoutes.discountManagement);
        },
      });
    },
    [client, mutation, navigate]
  );
  return { mutation, handleCreateDiscount };
};

export const useUpdateDisCount = (id) => {
  const navigate = useNavigate();
  const mutation = useMutation(updateDiscount, {
    mutationKey: [`discount/${id}`],
  });
  const client = useQueryClient();
  const handleUpdateDiscount = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("discounts");
          notification.success({
            message: "Sửa khuyến mãi thành công",
          });
          navigate(AppRoutes.discountManagement);
        },
      });
    },
    [client, mutation, navigate]
  );
  return {
    mutation,
    handleUpdateDiscount,
  };
};
export const useGetDiscountById = (id) => {
  const [discount, setDiscount] = useAtom(listDiscount);
  const { isLoading, error } = useQuery({
    queryKey: [`discount/${id}`],
    queryFn: () => getDiscountById(id),
    onSuccess: (res) => {
      setDiscount(res);
    },
  });
  return { isLoading, error, discount };
};
