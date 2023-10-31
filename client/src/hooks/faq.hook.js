import { useMutation, useQuery, useQueryClient } from "react-query";
import { listFaq } from "../states/faq.state";
import { useAtom } from "jotai";
import {
  changeIsActiveFaq,
  createFaq,
  deleteFaq,
  getFaqById,
  getFaqs,
  updateFaq,
} from "../api/faq.api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { AppRoutes } from "../helpers/app-routes";

export const useFAQ = (filter) => {
  const [faqs, setFaqs] = useAtom(listFaq);
  const { isLoading, error } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => getFaqs(filter),
    onSuccess: (res) => {
      setFaqs(res);
    },
  });
  return { isLoading, error, faqs };
};

export const useChangeIsActiveFaq = () => {
  const mutation = useMutation(changeIsActiveFaq, {
    mutationKey: [`faq/active`],
  });
  const client = useQueryClient();
  const handleChangeIsActiveFaq = useCallback(
    (data) => {
      console.log(data);
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("faqs");
          notification.success({
            message: "Sửa trạng thái câu hỏi thành công",
          });
        },
        onError: () => {
          client.invalidateQueries("faqs");
          notification.error({
            message: "Sửa trạng thái câu hỏi thất bại",
          });
        },
      });
    },
    [client, mutation]
  );
  return {
    mutation,
    handleChangeIsActiveFaq,
  };
};

export const useCreateFaq = () => {
  const navigate = useNavigate();
  const mutation = useMutation(createFaq, {
    mutationKey: "faq/create",
  });
  const client = useQueryClient();
  const handleCreateFaq = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("faqs");
          notification.success({
            message: "Thêm câu hỏi thành công",
          });
          navigate(AppRoutes.faqManagement);
        },
        onError: () => {
          notification.error({
            message: "Thêm câu hỏi thất bại",
          });
          navigate(AppRoutes.faqManagement);
        },
      });
    },
    [mutation]
  );
  return { mutation, handleCreateFaq };
};

export const useUpdateFaq = (id) => {
  const navigate = useNavigate();
  const mutation = useMutation(updateFaq, {
    mutationKey: [`faq/${id}`],
  });
  const client = useQueryClient();
  const handleUpdateFaq = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("faqs");
          notification.success({
            message: "Sửa câu hỏi thành công",
          });
          navigate(AppRoutes.faqManagement);
        },
      });
    },
    [client, mutation, navigate]
  );
  return {
    mutation,
    handleUpdateFaq,
  };
};
export const useGetFaqById = (id) => {
  const [faq, setFaq] = useAtom(listFaq);
  const { isLoading, error } = useQuery({
    queryKey: [`blog/${id}`],
    queryFn: () => getFaqById(id),
    onSuccess: (res) => {
      setFaq(res);
    },
  });
  return { isLoading, error, faq };
};
export const useDeleteFaq = () => {
  const mutation = useMutation(deleteFaq, {
    mutationKey: "faq",
  });
  const client = useQueryClient();
  const handleDeleteFaq = useCallback(
    (blogId) => {
      mutation.mutate(blogId, {
        onSuccess: () => {
          client.invalidateQueries("faqs");
          notification.success({
            message: "Xóa câu hỏi thành công",
          });
        },
        onError: () => {
          client.invalidateQueries("faqs");
          notification.error({
            message: "Xóa câu hỏi thất bại",
          });
        },
      });
    },
    [mutation]
  );
  return { mutation, handleDeleteFaq };
};
