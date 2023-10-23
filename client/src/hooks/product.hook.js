import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../helpers/app-routes";
import { listProduct } from "../states/product.state";
import {
  changeIsActiveProduct,
  createProduct,
  deleteProduct,
  getproducById,
  getproducs,
  updateProduct,
} from "../api/product.api";

export const useProduct = (filter) => {
  const [products, setProducts] = useAtom(listProduct);
  const { isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getproducs(filter),
    onSuccess: (res) => {
      setProducts(res.data);
    },
  });
  return { isLoading, error, products };
};

export const useGetProductById = (id) => {
  const [product, setProduct] = useAtom(listProduct);
  const { isLoading, error } = useQuery({
    queryKey: [`product/${id}`],
    queryFn: () => getproducById(id),
    onSuccess: (res) => {
      console.log(res.data);
      setProduct(res.data);
    },
  });
  return { isLoading, error, product };
};

export const useCreateProduct = () => {
  const navigate = useNavigate();
  const mutation = useMutation(createProduct, {
    mutationKey: "product",
  });
  const client = useQueryClient();
  const handleCreateProduct = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("products");
          notification.success({
            message: "Thêm sách thành công",
          });
          navigate(AppRoutes.product);
        },
      });
    },
    [mutation]
  );
  return { mutation, handleCreateProduct };
};

export const useDeleteProduct = () => {
  const mutation = useMutation(deleteProduct, {
    mutationKey: "products",
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

export const useChangeIsActiveProduct = (id) => {
  const mutation = useMutation(changeIsActiveProduct, {
    mutationKey: [`product/${id}/active`],
  });
  const client = useQueryClient();
  const handleChangeIsActiveProduct = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        client.invalidateQueries("products");
        notification.success({
          message: "Sửa trạng thái thành công",
        });
      },
    });
  };
  return {
    mutation,
    handleChangeIsActiveProduct,
  };
};

export const useUpdateProduct = (id) => {
  const navigate = useNavigate();

  const mutation = useMutation(updateProduct, {
    mutationKey: [`product/${id}`],
  });
  const client = useQueryClient();
  const handleUpdateProduct = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        client.invalidateQueries("products");
        notification.success({
          message: "Sửa thành công",
        });
        navigate(AppRoutes.product);
      },
    });
  };
  return {
    mutation,
    handleUpdateProduct,
    useGetProductById,
  };
};
