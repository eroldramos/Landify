import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { landifyLogo } from "@/assets/images";
import { PopoverMenu } from "./Menus";
import { useAppStore, useAuthStore } from "@/store/appStore";
import { getInitials } from "@/utils/string-utils";
import type { MenuItem } from "@/types/schema";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { showToast } from "@/utils/toast-utils";
import Swal from "sweetalert2";
export function Navigation() {
  const { auth, setAuth } = useAuthStore();

  const { search, setSearch } = useAppStore();
  const navigate = useNavigate();

  const menuItemsForRegular: MenuItem[] = [
    {
      path: "Log Out",
      onClick: () => {
        Swal.fire({
          title: "Are you sure you want to logout?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "black",
          cancelButtonColor: "gray",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            let timerInterval: number;

            Swal.fire({
              title: "Logging out",
              html: "You will be logged out in <b></b> milliseconds.",
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const popup = Swal.getPopup();
                if (popup) {
                  const timer = popup.querySelector("b");
                  if (timer) {
                    timerInterval = window.setInterval(() => {
                      const timeLeft = Swal.getTimerLeft();
                      if (timeLeft !== null) {
                        timer.textContent = `${timeLeft}`;
                      }
                    }, 100);
                  }
                }
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
                setAuth(null);
                showToast("info", { message: "You have been logged out." });
              }
            });
          }
        });
      },
    },
  ];
  const menuItemsForAdmin: MenuItem[] = [
    {
      path: "List Property",
      onClick: () => {
        navigate("/admin/list_property");
      },
    },
    {
      path: "Log Out",
      onClick: () => {
        Swal.fire({
          title: "Are you sure you want to logout?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "black",
          cancelButtonColor: "gray",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            let timerInterval: number;

            Swal.fire({
              title: "Logging out",
              html: "You will be logged out in <b></b> milliseconds.",
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const popup = Swal.getPopup();
                if (popup) {
                  const timer = popup.querySelector("b");
                  if (timer) {
                    timerInterval = window.setInterval(() => {
                      const timeLeft = Swal.getTimerLeft();
                      if (timeLeft !== null) {
                        timer.textContent = `${timeLeft}`;
                      }
                    }, 100);
                  }
                }
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
                setAuth(null);
                showToast("info", { message: "You have been logged out." });
              }
            });
          }
        });
      },
    },
  ];
  const pathname = window.location.pathname;
  useEffect(() => {
    if (auth?.expireAt) {
      const expiryDate = new Date(auth?.expireAt * 1000); // convert to ms

      const now = new Date();
      console.log(now, expiryDate);
      if (now > expiryDate) {
        showToast("info", { message: "You have been logged out" });
        setAuth(null);
      }
    }
    console.log(pathname);
  }, [auth?.expireAt, setAuth, pathname]);

  return (
    <nav className="bg-white border-b sticky top-0 z-20 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={landifyLogo} alt="app-logo" height={40} width={40} />
            <h1 className="text-xl font-bold text-gray-900">Landify</h1>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties..."
                className="pl-10 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Login button */}

          {!auth?.accessToken && (
            <Button size={"lg"} onClick={() => navigate("/auth")}>
              Login
            </Button>
          )}

          {/* User Actions */}
          {auth?.accessToken && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-4">
                <h1 className="text-sm hidden md:block text-black font-bold">
                  {auth?.name || "N/A"}
                </h1>
                <div>
                  <PopoverMenu
                    menuItems={
                      auth?.role == "ADMIN"
                        ? menuItemsForAdmin
                        : menuItemsForRegular
                    }
                    icon={
                      <h1>
                        {(auth?.name && getInitials(auth?.name)) || "N/A"}
                      </h1>
                    }
                    className="bg-gray-400 font-bold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search properties..."
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
