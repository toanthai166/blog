import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { notification } from "antd";
import { useCallback } from "react";

import { addToCart, myCart, removeToCart } from "../api/cart.api";
import {
  addToListFavorite,
  listFavorite,
  removeToListFavorite,
} from "../api/listFavorite.api";
import { list } from "../states/listFavorite.state";

export const useListFavorite = (userId) => {
  const [listBlog, setListBlog] = useAtom(list);
  const { isLoading, error } = useQuery({
    queryKey: ["favorite"],
    enabled: userId ? true : false,
    queryFn: useCallback(() => listFavorite(userId), [userId]),
    onSuccess: (res) => {
      setListBlog(res?.data?.results);
    },
  });
  return { isLoading, error, listBlog };
};

export const useAddToListFavorite = () => {
  const mutation = useMutation(addToListFavorite, {
    mutationKey: "favorite/create",
  });
  const client = useQueryClient();
  const hanldeAddToListBlog = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("favorite");

          notification.success({
            message: "Thêm bài viết vào danh sách yêu thích thành công",
          });
        },
        onError: () => {
          notification.error({
            message: "Thêm vào danh sách yêu thích thất bại",
          });
        },
      });
    },
    [client, mutation]
  );
  return { mutation, hanldeAddToListBlog };
};

export const useRemoveToListBlog = () => {
  const mutation = useMutation(removeToListFavorite, {
    mutationKey: [`cart/remove`],
  });
  const client = useQueryClient();
  const handleRemoveToListBlog = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("favorite");
          notification.success({
            message: "Xóa khỏi danh sách yêu thích thành công",
          });
        },
      });
    },
    [client, mutation]
  );
  return {
    mutation,
    handleRemoveToListBlog,
  };
};
