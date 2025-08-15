import type { OnError, OnSuccess } from "@/types/schema";
import request from "@/utils/axios-utils";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetListings = ({
  page = 1,
  limit = 10,
  status = "",
  propertyType = "",
  search = "",
  priceRange = [0, 100000],
}) => {
  return useQuery({
    queryKey: [
      "useGetListings",
      page,
      search,
      status,
      limit,
      propertyType,
      priceRange,
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

      if (priceRange[0] != 0 && priceRange[0] >= priceRange[1]) {
        filters.push(`minPrice=${priceRange[0]}`);
      }

      if (priceRange[1] != 0 && priceRange[1] <= priceRange[0]) {
        filters.push(`maxPrice=${priceRange[1]}`);
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
    mutationFn: (formData: unknown) => {
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

export const useRemoveListing = (
  onSuccess: OnSuccess,
  onError: OnError,
  id: number,
) => {
  return useMutation({
    mutationFn: (formData) => {
      return request({
        url: `/api/listing/delete/${id}`,
        method: "delete",
        data: formData,
      });
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};
