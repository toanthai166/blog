import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { notification } from "antd";
import { useCallback } from "react";

import { addToCart, myCart, removeToCart } from "../api/cart.api";
import { carts } from "../states/cart.state";

export const useCart = (userId) => {
  const [cart, setCart] = useAtom(carts);
  const { isLoading, error } = useQuery({
    queryKey: ["carts"],
    enabled: userId ? true : false,
    queryFn: useCallback(() => myCart(userId), [userId]),
    onSuccess: (res) => {
      setCart(res?.data?.results);
    },
  });
  return { isLoading, error, cart };
};

export const useAddToCart = () => {
  const mutation = useMutation(addToCart, {
    mutationKey: "cart/create",
  });
  const client = useQueryClient();
  const hanldeAddToCart = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("carts");
          notification.success({
            message: "Thêm vào giỏ hàng thành công",
          });
        },
        onError: () => {
          notification.error({
            message: "Thêm vào giỏ hàng thất bại",
          });
        },
      });
    },
    [client, mutation]
  );
  return { mutation, hanldeAddToCart };
};

export const useRemoveToCart = () => {
  const mutation = useMutation(removeToCart, {
    mutationKey: [`cart/remove`],
  });
  const client = useQueryClient();
  const handleRemoveToCart = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("carts");
          notification.success({
            message: "Xóa sản phẩm khỏi giỏ hàng thành công",
          });
        },
      });
    },
    [client, mutation]
  );
  return {
    mutation,
    handleRemoveToCart,
  };
};
