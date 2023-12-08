import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import {
  changeIsActiveCategory,
  createCategory,
  deleteCate,
  getCategories,
  getCategoriesIsActive,
  getCategoryById,
  updateCategory,
} from "../api/category.api";
import { listCategory } from "../states/category.state";
import { notification } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../helpers/app-routes";

export const useCategoriesIsActive = () => {
  const [categories, setCategories] = useAtom(listCategory);
  const { isLoading, error } = useQuery({
    queryKey: ["category?isActive=true"],
    queryFn: getCategoriesIsActive,
    onSuccess: (res) => {
      setCategories(res.data.results);
    },
  });
  return { isLoading, error, categories };
};

export const useCategories = () => {
  const [categories, setCategories] = useAtom(listCategory);
  const { isLoading, error } = useQuery({
    queryKey: ["category"],
    queryFn: getCategories,
    onSuccess: (res) => {
      setCategories(res.data);
    },
  });
  return { isLoading, error, categories };
};
// changeIsActiveCategory

export const useChangeIsActiveCategory = (id) => {
  const mutation = useMutation(changeIsActiveCategory, {
    mutationKey: [`category/${id}/active`],
  });
  const client = useQueryClient();
  const handleChangeIsActiveCate = (data) => {
    console.log(data);
    mutation.mutate(data, {
      onSuccess: () => {
        client.invalidateQueries("category");
        notification.success({
          message: "Sửa trạng thái danh mục thành công",
        });
      },
    });
  };
  return {
    mutation,
    handleChangeIsActiveCate,
  };
};

export const useDeleteCate = () => {
  const mutation = useMutation(deleteCate, {
    mutationKey: "category",
  });
  const client = useQueryClient();
  const handleDeleteCate = useCallback(
    (categoryId) => {
      mutation.mutate(categoryId, {
        onSuccess: () => {
          client.invalidateQueries("category");
          notification.success({
            message: "Xóa danh mục thành công",
          });
        },
      });
    },
    [mutation]
  );
  return { mutation, handleDeleteCate };
};

export const useCreateCategory = () => {
  const navigate = useNavigate();
  const mutation = useMutation(createCategory, {
    mutationKey: "category",
  });
  const client = useQueryClient();
  const handleCreateCategory = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("category");
          notification.success({
            message: "Thêm danh mục thành công",
          });
          navigate(AppRoutes.category);
        },
      });
    },
    [mutation]
  );
  return { mutation, handleCreateCategory };
};

export const useUpdateCate = (id) => {
  const navigate = useNavigate();

  const mutation = useMutation(updateCategory, {
    mutationKey: [`category/${id}`],
  });
  const client = useQueryClient();
  const handleUpdateCate = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        client.invalidateQueries("category");
        notification.success({
          message: "Sửa danh mục thành công",
        });
        navigate(AppRoutes.category);
      },
    });
  };
  return {
    mutation,
    handleUpdateCate,
  };
};
export const useGetCategoryById = (categoryId) => {
  const [cate, setCate] = useAtom(listCategory);
  const { isLoading, error } = useQuery({
    queryKey: [`category/${categoryId}`],
    queryFn: () => getCategoryById(categoryId),
    onSuccess: (res) => {
      setCate(res.data);
    },
  });
  return { isLoading, error, cate };
};
