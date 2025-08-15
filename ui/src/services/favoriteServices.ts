import type { OnError, OnSuccess } from "@/types/schema";
import request from "@/utils/axios-utils";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetFavorites = ({
  page = 1,
  limit = 10,
  status = "",
  propertyType = "",
  search = "",
  priceRange = [0, 100000],
}) => {
  return useQuery({
    queryKey: [
      "useGetFavorites",
      page,
      search,
      status,
      limit,
      propertyType,
      priceRange,
    ],
    queryFn: () => {
      let url = `/api/favorite/get?`;

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

export const useRemoveFavorite = (
  onSuccess: OnSuccess,
  onError: OnError,
  id: number,
) => {
  return useMutation({
    mutationFn: () => {
      return request({
        url: `/api/favorite/delete/${id}`,
        method: "delete",
        data: {},
      });
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useAddFavorite = (
  onSuccess: OnSuccess,
  onError: OnError,
  id: number,
) => {
  return useMutation({
    mutationFn: () => {
      return request({
        url: `/api/favorite/add/${id}`,
        method: "post",
        data: {},
      });
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};
