import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { listBlog } from "../states/blog.state";
import { changeIsActiveBlog, deleteBlog, getBlogs } from "../api/blog.api";
import { useCallback } from "react";
import { notification } from "antd";

export const useBlog = () => {
  const [blogs, setBlogs] = useAtom(listBlog);
  const { isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
    onSuccess: (res) => {
      setBlogs(res.data);
    },
  });
  return { isLoading, error, blogs };
};

export const useDeleteBlog = () => {
  const mutation = useMutation(deleteBlog, {
    mutationKey: "blogs",
  });
  const client = useQueryClient();
  const handleDeleteBlog = useCallback(
    (blogId) => {
      mutation.mutate(blogId, {
        onSuccess: () => {
          client.invalidateQueries("blogs");
          notification.success({
            message: "Xóa bài viết thành công",
          });
        },
      });
    },
    [mutation]
  );
  return { mutation, handleDeleteBlog };
};

export const useChangeIsActiveBlog = () => {
  const mutation = useMutation(changeIsActiveBlog, {
    mutationKey: [`blogs`],
  });
  const client = useQueryClient();
  const handleUpdateBlog = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        client.invalidateQueries("blogs");
        notification.success({
          message: "Sửa trạng thái bài viết thành công",
        });
      },
    });
  };
  return {
    mutation,
    handleUpdateBlog,
  };
};
