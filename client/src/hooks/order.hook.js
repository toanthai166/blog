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
  console.log("filter orrder :>> ", filter);
  const [orders, setOrders] = useAtom(listOrder);
  const { isLoading, error } = useQuery({
    queryKey: [`orders?status=${filter.status}`],
    queryFn: () => getOrders(filter),
    onSuccess: (res) => {
      setOrders(res.data);
    },
  });
  return { isLoading, error, orders };
};

export const useGetOrderById = (id) => {
  const [order, setOrder] = useAtom(listOrder);
  const { isLoading, error } = useQuery({
    queryKey: [`order/${id}`],
    queryFn: () => getOrderById(id),
    onSuccess: (res) => {
      setOrder(res?.data);
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
    [client, mutation, navigate]
  );
  return { mutation, handleCreateOrder };
};

export const useUpdateOrder = (filter) => {
  console.log("filter update :>> ", filter);
  const mutation = useMutation(updateOrder, {
    mutationKey: [`orderupdate`],
  });
  const client = useQueryClient();

  const handleUpdateOrder = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        if (filter.status == "wait_for_confirm")
          client.invalidateQueries(`orders?status="wait_for_confirm"`);
        if (filter.status == "shipping")
          client.invalidateQueries(`orders?status="shipping"`);
        if (filter.status == "delivered")
          client.invalidateQueries(`orders?status="delivered"`);
        if (filter.status == "complete")
          client.invalidateQueries(`orders?status="complete"`);
      },
    });
  };
  return {
    mutation,
    handleUpdateOrder,
  };
};
