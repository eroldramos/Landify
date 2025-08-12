import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/query-utils";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PropertyListingSinglePage from "./pages/PropertyListingSinglePage";
import PropertyListingPage from "./pages/PropertyListingPage";
import { Navigation } from "./components/navigation";
import AuthPage from "./pages/AuthPage";
import UnauthenticatedRoutes from "./components/ProtectedRoutes/UnaunthenticatedRoutes";
import { PropertyListingFormPage } from "./pages/PropertyListingFormPage";
import {
  PrivateAdminRoutes,
  PrivateRoutes,
} from "./components/ProtectedRoutes";
import PropertyListingEditPage from "./pages/PropertyListingEditPage";
import LoadingScreen from "./components/LoadingScreens/LoadingScreen";
import FavoritePage from "./pages/FavoritePage";
function App() {
  document.title = "Landify";

  const publicRoutes = [
    {
      path: "/property_listings/:listingId",
      element: <PropertyListingSinglePage />,
    },

    { path: "/", element: <PropertyListingPage /> },
    { path: "/property_listings", element: <PropertyListingPage /> },
  ];
  const privateRoutes = [{ path: "/my-favorites", element: <FavoritePage /> }];

  const privateAdminRoutes = [
    {
      path: "/admin/list_property",
      element: <PropertyListingFormPage />,
    },

    {
      path: "/admin/list_property/edit/:listingId",
      element: <PropertyListingEditPage />,
    },
  ];

  const unauthenticatedRoutes = [{ path: "/auth", element: <AuthPage /> }];

  return (
    <>
      <Toaster
        closeButton
        expand={false}
        visibleToasts={9}
        richColors
        toastOptions={{
          className: "p-3",
          classNames: {
            title: "font-extrabold",
          },
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingScreen />}>
            <Navigation />
            <Routes>
              <Route element={<UnauthenticatedRoutes />}>
                {unauthenticatedRoutes.map((route, index) => {
                  return <Route key={index} {...route} />;
                })}
              </Route>

              {/* <Route element={<PrivateRoutes />}>
                {privateRoutes.map((route, index) => {
                  return <Route key={index} {...route} />;
                })}
              </Route> */}

              <Route element={<PrivateAdminRoutes />}>
                {privateAdminRoutes.map((route, index) => {
                  return <Route key={index} {...route} />;
                })}
              </Route>
              {publicRoutes.map((route, index) => {
                return <Route key={index} {...route} />;
              })}
            </Routes>
          </Suspense>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
