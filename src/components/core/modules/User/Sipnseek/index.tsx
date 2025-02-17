import DistanceSelector from '@/components/core/common/Selector'
import { Button, Image, useDisclosure } from '@nextui-org/react'
import { MapPin, SearchIcon } from 'lucide-react'

export default function SpinSeekModules() {
    return (
        <main className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-12 md:grid-cols-2">
            <div className="space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-medium text-secondary sm:text-4xl">
                        Bữa ni đi
                        <span className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:gap-4">
                            <span className="block text-4xl font-extrabold text-primary sm:text-5xl">
                                quán cà phê
                            </span>
                            <span className="text-[#A46B27]">mô hè?</span>
                        </span>
                    </h1>
                </div>

                <div
                    className="space-y-4 rounded-xl bg-white p-5 shadow-lg"
                    style={{
                        boxShadow:
                            'rgba(233, 155, 97, 0.25) 0px 50px 100px -20px, rgba(233, 155, 97,0.4) 0px 30px 60px -30px',
                    }}
                >
                    <div className="relative">
                        <div className="flex w-full flex-row gap-5 rounded-md border border-secondary bg-white px-4 py-5">
                            <div>
                                <SearchIcon className="text-[14px] text-secondary" />
                            </div>
                            <div className="w-full">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="w-full border-none outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <DistanceSelector
                                prefix={
                                    <MapPin className="h-5 w-5 text-secondary" />
                                }
                                lable="Mục đích"
                                defaultValue=""
                                placeholder="Lựa chọn"
                                options={[{ label: '10km', value: '10' }]}
                            />
                        </div>
                        <div className="space-y-2">
                            <DistanceSelector
                                prefix={
                                    <MapPin className="h-5 w-5 text-secondary" />
                                }
                                lable="Khoảng cách"
                                defaultValue=""
                                placeholder="Lựa chọn"
                                options={[{ label: '10km', value: '10' }]}
                            />
                        </div>
                        <div className="space-y-2">
                            <DistanceSelector
                                prefix={
                                    <MapPin className="h-5 w-5 text-secondary" />
                                }
                                lable="Giá tiền"
                                defaultValue=""
                                placeholder="Lựa chọn"
                                options={[{ label: '10km', value: '10' }]}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-secondary accent-third"
                            />
                            <span className="text-xs sm:text-sm text-gray-600">
                                Chỉ tìm kiếm quán đang mở cửa
                            </span>
                        </div>

                        <Button className="rounded-full bg-[#E4833C] px-4 py-4  sm:px-6 sm:py-6 text-white">
                            <SearchIcon className="text-[16px] text-white" />
                            <p className="text-[18px] font-bold">Đi thôi</p>
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="text-[14px] text-third">#takeaway</div>
                        <div className="text-[14px] text-third">#chill</div>
                        <div className="text-[14px] text-third">#nguoiyeu</div>
                        <div className="text-[14px] text-third">
                            #ngoplecoffe
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <div>
                            <div className="flex flex-row items-center gap-2 rounded-full bg-secondary bg-opacity-15 px-4 py-2 text-third">
                                <MapPin size={16} />
                                <p className="text-[14px]">Hải Châu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative hidden h-[500px] items-center justify-center md:flex">
                <Image
                    src="/images/Background_Images.png"
                    alt="Coffee drink"
                    className="object-contain"
                    width={300}
                />
            </div>
        </main>
    )
}
