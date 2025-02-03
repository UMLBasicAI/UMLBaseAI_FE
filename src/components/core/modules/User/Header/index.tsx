"use client"
import SignInModal from '@/components/core/elements/Auth/Sign-In'
import { Button, Image, useDisclosure } from '@nextui-org/react'
import { Bookmark } from 'lucide-react'

export default function Header() {
    const {
        isOpen: isOpenSignInModal,
        onOpen: onOpenSignInModal,
        onOpenChange: onOpenChangeSignInModal,
    } = useDisclosure()
    return (
        <header className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
                <Image
                    src="/icons/sipnseek.png"
                    alt="Sip Seek Logo"
                    width={80}
                    height={60}
                    className=""
                />
            </div>

            <nav className="flex items-center gap-6">
                <a
                    href="#"
                    className="text-[#7B3F00] transition-all hover:text-[#E4833C]"
                >
                    Cà phê Đà Thành
                </a>
                <a
                    href="#"
                    className="text-[#7B3F00] transition-all hover:text-[#E4833C]"
                >
                    Cà phê Phố cổ Hội An
                </a>
                <a
                    href="#"
                    className="text-[#7B3F00] transition-all hover:text-[#E4833C]"
                >
                    Liên hệ
                </a>
                <a
                    href="#"
                    className="text-[#7B3F00] transition-all hover:text-[#E4833C]"
                >
                    <Bookmark />
                </a>
                <Button
                    className="rounded-full bg-[#E4833C] text-white"
                    onPress={onOpenSignInModal}
                >
                    Đăng nhập
                </Button>
            </nav>
            <SignInModal
                onClose={onOpenChangeSignInModal}
                isOpen={isOpenSignInModal}
                onOpenChange={onOpenChangeSignInModal}
            />
        </header>
    )
}
