import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
});
export const invalidateQuery = (
  queryKey: string | number | (string | number)[],
) => {
  queryClient.invalidateQueries({
    queryKey: Array.isArray(queryKey) ? [...queryKey] : [queryKey],
    exact: false,
  });
};
