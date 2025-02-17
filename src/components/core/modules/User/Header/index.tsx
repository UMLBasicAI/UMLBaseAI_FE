"use client"
import { useState, useEffect } from "react"
import SignInModal from "@/components/core/elements/Auth/Sign-In"
import { Button, Image, useDisclosure } from "@nextui-org/react"
import { Bookmark, Menu, X } from "lucide-react"

export default function Header() {
  const {
    isOpen: isOpenSignInModal,
    onOpen: onOpenSignInModal,
    onOpenChange: onOpenChangeSignInModal,
  } = useDisclosure()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const navItems = [
    { href: "#", text: "Cà phê Đà Thành" },
    { href: "#", text: "Cà phê Phố cổ Hội An" },
    { href: "#", text: "Liên hệ" },
  ]

  return (
    <header className="mx-auto max-w-[1440px] px-4 py-4 relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/icons/sipnseek.png" alt="Sip Seek Logo" width={80} height={60} />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <a key={index} href={item.href} className="text-[#7B3F00] transition-all hover:text-[#E4833C]">
              {item.text}
            </a>
          ))}
          <a href="#" className="text-[#7B3F00] transition-all hover:text-[#E4833C]">
            <Bookmark />
          </a>
          <Button className="rounded-full bg-[#E4833C] text-white" onPress={onOpenSignInModal}>
            Đăng nhập
          </Button>
        </nav>

        <button className="md:hidden text-[#7B3F00] z-50" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
      ></div>

      <nav
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col gap-4 p-6 mt-16">
          {navItems.map((item, index) => (
            <a key={index} href={item.href} className="text-[#7B3F00] transition-all hover:text-[#E4833C]">
              {item.text}
            </a>
          ))}
          <a href="#" className="text-[#7B3F00] transition-all hover:text-[#E4833C] flex items-center gap-2">
            <Bookmark size={20} />
            <span>Bookmark</span>
          </a>
          <Button
            className="rounded-full bg-[#E4833C] text-white w-full"
            onPress={() => {
              setIsMobileMenuOpen(false)
              onOpenSignInModal()
            }}
          >
            Đăng nhập
          </Button>
        </div>
      </nav>

      <SignInModal
        onClose={onOpenChangeSignInModal}
        isOpen={isOpenSignInModal}
        onOpenChange={onOpenChangeSignInModal}
      />
    </header>
  )
}

