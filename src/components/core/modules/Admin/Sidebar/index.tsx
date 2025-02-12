'use client'

import React from 'react'
import { Listbox, ListboxItem, Button } from '@nextui-org/react'
import { Home, Users, StoreIcon, BarChart2, Settings, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const menuItems = [
    { key: 'dashboard', label: 'Trang chủ', icon: Home },
    { key: 'users', label: 'Người dùng', icon: Users },
    { key: 'stores', label: 'Cửa hàng', icon: StoreIcon },
    { key: 'analytics', label: 'Thư viện', icon: BarChart2 },
    { key: 'settings', label: 'Cài đặt', icon: Settings },
]

interface SidebarProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    return (
        <>
            <div
                className={`fixed inset-0 z-20 bg-black opacity-50 transition-opacity lg:hidden ${open ? 'block' : 'hidden'}`}
                onClick={() => setOpen(false)}
            ></div>

            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto border-r border-r-secondary bg-white transition duration-300 lg:static lg:inset-0 lg:translate-x-0 ${
                    open
                        ? 'translate-x-0 ease-out'
                        : '-translate-x-full ease-in'
                }`}
            >
                <div className="flex flex-shrink-0 items-center justify-between p-4">
                    <span className="text-lg font-semibold text-secondary">
                        Admin Dashboard
                    </span>
                    <Button
                        isIconOnly
                        className="lg:hidden"
                        size="sm"
                        variant="light"
                        onPress={() => setOpen(false)}
                    >
                        <X size={20} />
                    </Button>
                </div>
                <nav className="mt-5">
                    <Listbox
                        aria-label="Menu"
                        className="p-0"
                        itemClasses={{
                            base: 'px-4 py-3 rounded-none data-[hover=true]:bg-third',
                        }}
                    >
                        {menuItems.map((item) => (
                            <ListboxItem
                                key={item.key}
                                startContent={
                                    <item.icon className="mr-2" size={20} />
                                }
                                className={
                                    pathname.includes(item.key) ||
                                    pathname.includes(`/admin/${item.key}`)
                                        ? 'bg-third'
                                        : ''
                                }
                                onPress={() =>
                                    router.push(`/admin/${item.key}`)
                                }
                            >
                                <p>{item.label}</p>
                            </ListboxItem>
                        ))}
                    </Listbox>
                </nav>
            </div>
        </>
    )
}
