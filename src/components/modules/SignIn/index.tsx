'use client'

import { useAuth } from '@/context/AuthContext'
import { userData } from '@/data/authData'
import { useExampleRequestLoginMutation } from '@/store/feature/auth/authApi'
import { Form, message } from 'antd'
import { useRouter } from 'next/navigation'

export default function SignIn() {
    const router = useRouter()

    const [requestLogin] = useExampleRequestLoginMutation()
    const { login } = useAuth()

    const handleClickLogin = async () => {
        await requestLogin({
            username: 'abasssa',
            password: '123456',
            isRemember: true,
        })
        message.success('Đăng nhập thành công!')

        login(userData)
        router.push('/chat/1')
    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
                <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
                    <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                            Sign in to your account
                        </h1>
                        <Form className="space-y-4 md:space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="name@company.com"
                                    required={true}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    required={true}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="focus:ring-3 focus:ring-primary-300 h-4 w-4 rounded border border-gray-300 bg-gray-50"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label className="text-gray-500 dark:text-gray-300">
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <a
                                    href="#"
                                    className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
                                >
                                    forgot password?
                                </a>
                            </div>
                            <button
                                onClick={handleClickLogin}
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
                            >
                                Sign in
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet?{' '}
                                <a
                                    href="#"
                                    className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                                >
                                    Sign up
                                </a>
                            </p>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    )
}
