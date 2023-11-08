import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";

import { useCallback } from "react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../helpers/app-routes";
import { listOrder } from "../states/order.state";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../api/order.api";

export const useOrder = (filter) => {
  const [orders, setOrders] = useAtom(listOrder);
  const { isLoading, error } = useQuery({
    queryKey: [`orders?status=${filter.status}`],
    queryFn: () => getOrders(filter),
    onSuccess: (res) => {
      console.log(res.data);
      setOrders(res.data);
    },
  });
  return { isLoading, error, orders };
};

export const useGetOrderById = (id) => {
  const [order, setBlog] = useAtom(listOrder);
  const { isLoading, error } = useQuery({
    queryKey: [`order/${id}`],
    queryFn: () => getOrderById(id),
    onSuccess: (res) => {
      setBlog(res.data);
    },
  });
  return { isLoading, error, order };
};

export const useCreateOrder = () => {
  const navigate = useNavigate();
  const mutation = useMutation(createOrder, {
    mutationKey: "orders",
  });
  const client = useQueryClient();
  const handleCreateOrder = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("orders");
          notification.success({
            message: "Tạo đơn hàng thành công",
          });
          navigate(AppRoutes.product);
        },
      });
    },
    [mutation]
  );
  return { mutation, handleCreateOrder };
};

export const useUpdateOrder = (id) => {
  const navigate = useNavigate();

  const mutation = useMutation(updateOrder, {
    mutationKey: [`order/${id}`],
  });
  const handleUpdateOrder = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        navigate(AppRoutes.orderManagement);
      },
    });
  };
  return {
    mutation,
    handleUpdateOrder,
  };
};
