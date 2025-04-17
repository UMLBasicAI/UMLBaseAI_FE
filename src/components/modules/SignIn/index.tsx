"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { userData } from "@/data/authData"
import { useGetUserIdQuery, useSignInMutation } from "@/store/feature/auth/authApi"
import { useRouter } from "next/navigation"
import webStorageClient from "@/utils/webStorageClient"
import { LockIcon, MailIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import Link from "next/link"
import { message } from "antd"
import { useDispatch } from "react-redux"
import { setUserInfo } from "@/store/feature/auth/auth"
import useGetSWR from "@/hooks/useGetSWR"

export default function SignIn() {
  const router = useRouter()
  const [requestLogin] = useSignInMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })
  const dispatch = useDispatch();

  const validateForm = () => {
    let valid = true
    const newErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleClickLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
    setErrors({ email: "", password: "" });
  
    try {
      await requestLogin({
        username: email,
        password,
        isRemember: rememberMe,
      }).unwrap();
      message.success("Login successful! Redirecting...");
      router.push("/chat");

    } catch (error) {
      console.error("Login failed:", error);
      setErrors(prev => ({ ...prev, password: "Invalid credentials" }));
    } finally {
      setIsLoading(false);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gray-200 dark:bg-gray-700"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.4,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1],
              opacity: [0, 0.4],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              repeatDelay: Math.random() * 5 + 5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          className="relative w-full max-w-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <div className="overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
            <div className="relative">
              {/* Header gradient */}
              <div className="absolute inset-0 h-20 bg-gradient-to-r from-gray-700 to-gray-900"></div>

              <div className="relative px-8 pt-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-2 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 shadow-md dark:bg-gray-700">
                    <LockIcon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
                </motion.div>

                <motion.form
                  className="mt-8 space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MailIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full rounded-lg border ${
                          errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        } bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500`}
                        placeholder="name@company.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block w-full rounded-lg border ${
                          errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        } bg-gray-50 p-2.5 pl-10 pr-10 text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                      >
                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="#"
                      className="text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleClickLogin(e as unknown as React.FormEvent<HTMLFormElement>)}
                      disabled={isLoading}
                      className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 px-5 py-3 text-center text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                      <span className="relative z-10">
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Signing in...
                          </div>
                        ) : (
                          "Sign in"
                        )}
                      </span>
                      <div className="absolute bottom-0 left-0 h-full w-full translate-y-full bg-gradient-to-r from-gray-800 to-gray-950 transition-transform duration-300 group-hover:translate-y-0"></div>
                    </motion.button>
                  </motion.div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                    <span className="mx-4 flex-shrink text-sm text-gray-600 dark:text-gray-400">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                  </div>


                  <motion.p
                    className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                  >
                    Don't have an account yet?{" "}
                    <Link
                      href="/sign-up"
                      className="font-medium text-gray-700 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
                    >
                      Sign up
                    </Link>
                  </motion.p>
                </motion.form>
              </div>

              <div className="mt-8 bg-gray-50 px-8 py-6 dark:bg-gray-700/30">
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                  By signing in, you agree to our{" "}
                  <Link href="#" className="underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
