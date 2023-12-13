import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { blogItem, listBlog } from "../states/blog.state";
import {
  changeIsActiveBlog,
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from "../api/blog.api";
import { useCallback } from "react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../helpers/app-routes";

export const useBlog = (filter) => {
  const [blogs, setBlogs] = useAtom(listBlog);
  const { isLoading, error } = useQuery({
    queryKey: [
      `blogs/${filter.page}&&${filter.title}&&${filter.categoryId}&&${filter.title}`,
    ],
    queryFn: useCallback(() => getBlogs(filter), [filter]),
    onSuccess: (res) => {
      setBlogs(res.data);
    },
  });
  return { isLoading, error, blogs };
};

export const useAdminBlog = (filter) => {
  const [blogs, setBlogs] = useAtom(listBlog);
  const { isLoading, error } = useQuery({
    queryKey: [`blogs`],
    queryFn: useCallback(() => getBlogs(filter), [filter]),
    onSuccess: (res) => {
      setBlogs(res.data);
    },
  });
  return { isLoading, error, blogs };
};

export const useGetBlogById = (blogId) => {
  const [blog, setBlog] = useAtom(blogItem);
  const { isLoading, error } = useQuery({
    queryKey: [`blog/${blogId}`],
    queryFn: () => getBlogById(blogId),
    enabled: blogId ? true : false,
    onSuccess: (res) => {
      setBlog(res.data);
    },
  });
  return { isLoading, error, blog };
};

export const useCreateBlog = () => {
  const navigate = useNavigate();
  const mutation = useMutation(createBlog, {
    mutationKey: "blogs",
  });
  const client = useQueryClient();
  const handleCreateBlog = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("blogs");
          notification.success({
            message: "Thêm bài viết thành công",
          });
          navigate(AppRoutes.blog);
        },
      });
    },
    [mutation]
  );
  return { mutation, handleCreateBlog };
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

export const useChangeIsActiveBlog = (id) => {
  const mutation = useMutation(changeIsActiveBlog, {
    mutationKey: [`blogs/${id}/active`],
  });
  const client = useQueryClient();
  const handleChangeIsActiveBlog = (data) => {
    console.log(data);
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
    handleChangeIsActiveBlog,
  };
};

export const useUpdateBlog = (id) => {
  const navigate = useNavigate();

  const mutation = useMutation(updateBlog, {
    mutationKey: [`blogs/${id}`],
  });
  const client = useQueryClient();
  const handleUpdateBlog = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        client.invalidateQueries("blogs");
        notification.success({
          message: "Sửa bài viết thành công",
        });
        navigate(AppRoutes.blog);
      },
    });
  };
  return {
    mutation,
    handleUpdateBlog,
  };
};
