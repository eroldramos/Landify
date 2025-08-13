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
export const invalidateQuery = (queryKey: string | string[]) => {
  queryClient.invalidateQueries({
    queryKey: typeof queryKey === "string" ? [queryKey] : [...queryKey],
  });
};
