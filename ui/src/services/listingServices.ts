import type { OnError, OnSuccess } from "@/types/schema";
import request from "@/utils/axios-utils";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetListings = ({
  page = 1,
  limit = 10,
  status = "",
  propertyType = "",
  search = "",
  minPrice = 0,
  maxPrice = 100000,
}) => {
  return useQuery({
    queryKey: [
      "useGetListings",
      page,
      search,
      status,
      limit,
      propertyType,
      minPrice,
      maxPrice,
    ],
    queryFn: () => {
      let url = `/api/listing/get?`;

      const filters = [`page=${page}`, `search=${search}`, `limit=${limit}`];

      if (status) {
        filters.push(`status=${status === "ALL" ? "" : status}`);
      }
      if (propertyType) {
        filters.push(
          `propertyType=${propertyType === "ALL" ? "" : propertyType}`,
        );
      }

      if (minPrice > 0) {
        filters.push(`minPrice=${minPrice}`);
      }

      if (maxPrice < 250000) {
        filters.push(`maxPrice=${maxPrice}`);
      }

      url += filters.join("&");

      return request({
        url: url,
      });
    },
  });
};

export const useGetListingOne = ({ id = 0 }) => {
  return useQuery({
    queryKey: ["useGetListingOne", id],
    queryFn: () => {
      const url = `/api/listing/get/${id}`;

      return request({
        url: url,
      });
    },
  });
};

export const useListProperty = (onSuccess: OnSuccess, onError: OnError) => {
  return useMutation({
    mutationFn: (formData) => {
      return request({
        url: `/api/listing/create`,
        method: "post",
        data: formData,
      });
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useUpdateProperty = (
  onSuccess: OnSuccess,
  onError: OnError,
  id: number,
) => {
  return useMutation({
    mutationFn: (formData) => {
      return request({
        url: `/api/listing/update/${id}`,
        method: "put",
        data: formData,
      });
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};
