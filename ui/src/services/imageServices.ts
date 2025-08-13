import type { OnError, OnSuccess } from "@/types/schema";
import request from "@/utils/axios-utils";
import { useMutation } from "@tanstack/react-query";

export const useUploadImages = (
  onSuccess: OnSuccess,
  onError: OnError,
  id: number,
) => {
  return useMutation({
    mutationFn: (formData) => {
      return request({
        url: `/api/image/uploads/${id}`,
        method: "post",
        data: formData,
        headers: {
          // Let the browser set the correct boundary for multipart/form-data
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useRemoveImages = (onSuccess: OnSuccess, onError: OnError) => {
  return useMutation({
    mutationFn: (formData) => {
      return request({
        url: `/api/image/remove_images`,
        method: "delete",
        data: formData,
      });
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};
