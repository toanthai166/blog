import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { notification } from "antd";
import { createComment, deleteComment, getComments } from "../api/comment.api";
import { listComment } from "../states/comment.state";

export const useComment = (id) => {
  const [comments, setComments] = useAtom(listComment);
  const { isLoading, error } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getComments(id),
    onSuccess: (res) => {
      setComments(res.data);
    },
  });
  return { isLoading, error, comments };
};

export const useCreateComment = () => {
  const mutation = useMutation(createComment, {
    mutationKey: "comment",
  });
  const client = useQueryClient();
  const handleCreateComment = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("comments");
        },
      });
    },
    [mutation]
  );
  return { mutation, handleCreateComment };
};

export const useDeleteProduct = () => {
  const mutation = useMutation(deleteComment, {
    mutationKey: "delete/comment",
  });
  const client = useQueryClient();
  const handleDeleteProduct = useCallback(
    (blogId) => {
      mutation.mutate(blogId, {
        onSuccess: () => {
          client.invalidateQueries("products");
          notification.success({
            message: "Xóa sách thành công",
          });
        },
      });
    },
    [mutation]
  );
  return { mutation, handleDeleteProduct };
};
