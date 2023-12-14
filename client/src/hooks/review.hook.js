import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { notification } from "antd";
import { createReview, getReviews } from "../api/review.api";
import { listReview } from "../states/review.state";

export const useReview = (filter) => {
  const [review, setReview] = useAtom(listReview);
  const { isLoading, error } = useQuery({
    queryKey: [
      `reviews/${filter.page}&&${filter.title}&&${filter.categoryId}&&${filter.rating}`,
    ],
    queryFn: useCallback(() => getReviews(filter), [filter]),
    onSuccess: (res) => {
      setReview(res.data);
    },
  });
  return { isLoading, error, review };
};

export const useCreateReview = () => {
  const mutation = useMutation(createReview, {
    mutationKey: "reviews",
  });
  const client = useQueryClient();
  const handleCreateReview = useCallback(
    (data) => {
      console.log("data :>> ", data);
      mutation.mutate(data, {
        onSuccess: () => {
          client.invalidateQueries("rv");
          notification.success({
            message: "Đánh giá thành công thành công",
          });
        },
      });
    },
    [mutation]
  );
  return { mutation, handleCreateReview };
};
