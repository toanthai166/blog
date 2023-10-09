import { useQuery } from "react-query";
import { listFaq } from "../states/faq.state";
import { useAtom } from "jotai";
import { getFaqs } from "../api/faq.api";
export const useFAQ = () => {
  const [Faqs, setFaqs] = useAtom(listFaq);
  const { isLoading, error } = useQuery({
    // queryKey: ["faq"],
    queryFn: getFaqs,
    onSuccess: (res) => {
      setFaqs(res.results);
    },
  });
  return { isLoading, error, Faqs };
};

// export const useUpdatePost = (data) => {
//   const mutation = useMutation(updateBlog, {
//     mutationKey: [`blogs/${data.blogId}`],
//   });
//   const client = useQueryClient();
//   const handleUpdateBlog = () => {
//     mutation.mutate(data, {
//       onSuccess: () => {
//         client.invalidateQueries(QUERY_KEYS.posts);
//         successToast("Cập nhật bài viết thành công");
//       },
//     });
//   };
//   return {
//     mutation,
//     handleUpdateBlog,
//   };
// };
// export const usePublishPost = (data) => {
//   const mutation = useMutation(publishBlog, {
//     mutationKey: [`blogs/${data.blogId}/publish`],
//   });
//   const client = useQueryClient();
//   const handleUpdateBlog = () => {
//     mutation.mutate(data, {
//       onSuccess: () => {
//         client.invalidateQueries(QUERY_KEYS.posts);
//         successToast("Cập nhật bài viết thành công");
//       },
//     });
//   };
//   return {
//     mutation,
//     handleUpdateBlog,
//   };
// };

// export const useGetPublishPost = () => {
//   //   const [listTag, setListTag] = useAtom(listTagAtom);
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["blogs/published"],
//     queryFn: getPublishedBlogs,
//     // onSuccess: (res) => {
//     //   console.log(res.data);
//     //   return res.data;
//     // },
//   });
//   return { publishBlogs: data?.data, isLoading, error };
// };

// export const useDetailPost = (blogId) => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: [`blogs/${blogId}`],
//     queryFn: () => getDetails(blogId),
//     // onSuccess: (res) => {
//     //   console.log(res.data);
//     //   return res.data;
//     // },
//   });
//   return {
//     detailBlog: data?.data?.blog?.details,
//     isLoading,
//     error,
//   };
// };

// export const useUploadTitleImage = () => {
//   const [, setTitleImageLink] = useAtom(titleImageLinkAtom);
//   const titleImageLink = JSON.parse(localStorage.getItem("titleImageLink"));

//   const mutation = useMutation(upLoadTitleImage, {
//     mutationKey: "uploadTitleImage",
//     onSuccess: (data) => {
//       console.log(data);
//       setTitleImageLink(data.data.imageLink);
//     },
//   });
//   const handleUploadTitleImage = useCallback(
//     (formData) => {
//       mutation.mutate(formData);
//     },
//     [mutation]
//   );
//   const resetImage = useCallback(() => {
//     setTitleImageLink(RESET);
//   }, [mutation]);
//   return {
//     titleImageLink,
//     mutation,
//     handleUploadTitleImage,
//     resetImage,
//   };
// };
