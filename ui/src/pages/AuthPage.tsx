import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowRight, User } from "lucide-react";
import { landifyLogo } from "@/assets/images";
import { useLogin, useRegister } from "@/services/authServices";
import { showToast } from "@/utils/toast-utils";
import type {
  LoginResponse,
  MessageResponse,
  RegisterUser,
} from "@/types/schema";
import { useAuthStore } from "@/store/appStore";

export default function AuthPage() {
  // Services
  const { setAuth } = useAuthStore();
  const registerMutate = useRegister(
    (data) => {
      resetForm();
      showToast("success", {
        message: (data.data as MessageResponse).message,
      });
    },
    (error) => {
      showToast("error", {
        message: error?.response?.data?.message,
      });
    },
  );
  const loginMutate = useLogin(
    (success) => {
      resetForm();
      showToast("success", {
        message: "Login successfully",
      });

      setAuth(success?.data as LoginResponse);
    },
    (error) => {
      showToast("error", {
        message: error?.response?.data?.message,
      });
    },
  );

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Password validation rules
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    maxLength: password.length <= 128,
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordStrength =
    Object.values(passwordValidation).filter(Boolean).length;

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin && password !== confirmPassword) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    const formData: RegisterUser = {
      email,
      password,
      name,
    };

    if (!isLogin) registerMutate.mutate(formData);
    if (isLogin) loginMutate.mutate(formData);

    console.log(isLogin ? "Login attempt" : "Sign up attempt", {
      email,
      password,
      name,
    });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setPasswordTouched(false);
    setConfirmPasswordTouched(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-gray-50 to-slate-50 py-5">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r  bg-gray-300 rounded-2xl mb-6">
            <img src={landifyLogo} alt="app-logo" height={40} width={40} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            {isLogin ? "Welcome to Landify" : "Get started"}
          </h1>
          <p className="text-gray-600">
            {isLogin ? "Sign in to your account" : "Create your account today"}
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-xl shadow-black/5 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !isLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign Up
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-gray-200 focus:border-zinc-500 focus:ring-zinc-500/20 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Full Name Field */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className={`pl-10 h-12 border-gray-200 focus:border-zinc-500 focus:ring-zinc-500/20 rounded-xl`}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordTouched(true)}
                    placeholder={
                      isLogin ? "Enter your password" : "Create a password"
                    }
                    className="pl-10 pr-12 h-12 border-gray-200 focus:border-zinc-500 focus:ring-zinc-500/20 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator (Sign Up Only) */}
                {!isLogin && passwordTouched && password && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Password strength</span>
                        <span
                          className={`font-medium ${
                            passwordStrength <= 2
                              ? "text-red-600"
                              : passwordStrength <= 4
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div
                        className={`flex items-center space-x-2 ${
                          passwordValidation.minLength
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            passwordValidation.minLength
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span>At least 8 characters</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${
                          passwordValidation.hasUppercase
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            passwordValidation.hasUppercase
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span>One uppercase letter</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${
                          passwordValidation.hasLowercase
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            passwordValidation.hasLowercase
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span>One lowercase letter</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${
                          passwordValidation.hasNumber
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            passwordValidation.hasNumber
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span>One number</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${
                          passwordValidation.hasSpecialChar
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            passwordValidation.hasSpecialChar
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span>One special character (!@#$%^&*)</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${
                          passwordValidation.maxLength
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            passwordValidation.maxLength
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span>Maximum 128 characters</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setConfirmPasswordTouched(true)}
                      placeholder="Confirm your password"
                      className={`pl-10 h-12 border-gray-200 focus:border-zinc-500 focus:ring-zinc-500/20 rounded-xl ${
                        confirmPasswordTouched &&
                        confirmPassword &&
                        password !== confirmPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : confirmPasswordTouched &&
                            confirmPassword &&
                            password === confirmPassword
                          ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                          : ""
                      }`}
                      required
                    />
                    {/* Validation Icon */}
                    {confirmPasswordTouched && confirmPassword && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {password === confirmPassword ? (
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Validation Messages */}
                  {confirmPasswordTouched && confirmPassword && (
                    <div className="space-y-1">
                      {password !== confirmPassword ? (
                        <div className="flex items-center space-x-2 text-red-500 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          <span>Passwords don't match</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-green-600 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span>Passwords match</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Forgot Password (Login Only) */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-zinc-600 hover:text-zinc-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-900 hover:to-zinc-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-zinc-500/25 hover:shadow-xl hover:shadow-zinc-500/30"
                disabled={
                  !email ||
                  !password ||
                  (!isLogin &&
                    (!isPasswordValid || password !== confirmPassword)) ||
                  (isLogin && password.length === 0) ||
                  isLoading
                }
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {loginMutate?.isPending ||
                      registerMutate?.isPending ||
                      isLogin
                        ? "Signing in..."
                        : "Creating account..."}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>
                      {loginMutate?.isPending ||
                      registerMutate?.isPending ||
                      isLogin
                        ? "Sign in"
                        : "Create account"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Terms */}
            {!isLogin && (
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                By creating an account, you agree to our{" "}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </button>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span className="font-semibold text-zinc-600 hover:text-zinc-700">
                  Sign up for free
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="font-semibold text-zinc-600 hover:text-zinc-700">
                  Sign in
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
