import { Button, Image } from '@nextui-org/react'
import { Bookmark } from 'lucide-react'

export default function Header() {
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
                <a href="#" className="text-[#7B3F00] hover:text-[#E4833C] transition-all">
                    Cụ chế địa thành
                </a>
                <a href="#" className="text-[#7B3F00] hover:text-[#E4833C] transition-all">
                    Phê phê phố
                </a>
                <a href="#" className="text-[#7B3F00] hover:text-[#E4833C] transition-all">
                    Liên hệ
                </a>
                <a href="#" className="text-[#7B3F00] hover:text-[#E4833C] transition-all">
                    <Bookmark/>
                </a>
                <Button className="rounded-full bg-[#E4833C] text-white">
                    Đăng nhập
                </Button>
            </nav>
        </header>
    )
}
