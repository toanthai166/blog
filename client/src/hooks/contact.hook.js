import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";

import { useCallback } from "react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../helpers/app-routes";
import { listContact } from "../states/contact.state";
import {
  createContact,
  getContactById,
  getContacts,
  updateContact,
} from "../api/contact.api";

export const useContact = (filter) => {
  const [contacts, setContacts] = useAtom(listContact);
  const { isLoading, error } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts(filter),
    onSuccess: (res) => {
      setContacts(res.data);
    },
  });
  return { isLoading, error, contacts };
};

export const useGetContactById = (id) => {
  const [contact, setContact] = useAtom(listContact);
  const { isLoading, error } = useQuery({
    queryKey: [`contact/${id}`],
    queryFn: () => getContactById(id),
    onSuccess: (res) => {
      console.log(res.data);
      setContact(res.data);
    },
  });
  return { isLoading, error, contact };
};

export const useCreateContact = () => {
  const navigate = useNavigate();
  const mutation = useMutation(createContact, {
    mutationKey: "contact",
  });
  const handleCreateContact = useCallback(
    (data) => {
      mutation.mutate(data, {
        onSuccess: () => {
          notification.success({
            message: "Gửi liên hệ thành công",
          });
          navigate(AppRoutes.home);
        },
      });
    },
    [mutation]
  );
  return { mutation, handleCreateContact };
};

export const useUpdateContact = (id) => {
  const navigate = useNavigate();

  const mutation = useMutation(updateContact, {
    mutationKey: [`contact/${id}`],
  });
  const client = useQueryClient();
  const handleUpdateContact = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        client.invalidateQueries("contacts");
        notification.success({
          message: "Phản hồi người dùng thành công",
        });
        navigate(AppRoutes.contactManagement);
      },
    });
  };
  return {
    mutation,
    handleUpdateContact,
  };
};
