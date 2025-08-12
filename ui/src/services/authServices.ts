import type { OnError, OnSuccess, RegisterUser } from "@/types/schema";
import request from "@/utils/axios-utils";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRegister = (onSuccess: OnSuccess, onError: OnError) => {
  return useMutation({
    mutationFn: (formData: RegisterUser) => {
      return request({
        url: `/api/supabase/register`,
        method: "post",
        data: formData,
      });
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useLogin = (onSuccess: OnSuccess, onError: OnError) => {
  return useMutation({
    mutationFn: (formData: RegisterUser) => {
      return request({
        url: `api/supabase/login`,
        method: "post",
        data: formData,
      });
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useGetCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    enabled,
    queryKey: ["useGetCurrentUser"],
    queryFn: () => {
      return request({
        url: `/api/supabase/current_user`,
      });
    },
  });
};
