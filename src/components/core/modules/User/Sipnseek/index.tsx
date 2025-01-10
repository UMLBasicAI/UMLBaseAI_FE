import DistanceSelector from '@/components/core/common/DistanceSelector'
import { Button, Chip, Image, Input } from '@nextui-org/react'
import { MapPin, Pointer, SearchIcon } from 'lucide-react'
import React from 'react'

export default function SpinSeekModules() {
    return (
        <main className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-12 md:grid-cols-2">
            <div className="space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-medium text-secondary">
                        Bữa ni đi
                        <span className="flex flex-row items-end gap-4">
                            <span className="block text-5xl font-extrabold text-primary">
                                quán cà phê
                            </span>
                            <span className="text-[#A46B27]">mô hè?</span>
                        </span>
                    </h1>
                </div>

                <div className="space-y-4 rounded-xl bg-white p-5">
                    <div className="relative">
                        <div className="flex w-full flex-row gap-5 rounded-md border border-secondary bg-white px-4 py-5">
                            <div>
                                <SearchIcon className="text-[14px] text-secondary" />
                            </div>
                            <div className="w-full">
                                <input
                                    type="text"
                                    placeholder="giá rẻ, ngon, gần đây, Đà Nẵng, chill..."
                                    className="w-full border-none outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <DistanceSelector
                                lable="Khoảng cách"
                                defaultValue=""
                                placeholder="Lựa chọn"
                                options={[{ label: '10km', value: '10' }]}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">
                                Loại hình
                            </label>
                            <Input
                                placeholder="Lựa chọt"
                                className="w-full rounded-xl bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">
                                Thời gian
                            </label>
                            <Input
                                placeholder="Lựa chọt"
                                className="w-full rounded-xl bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-secondary accent-third"
                            />
                            <span className="text-sm text-gray-600">
                                Chỉ tìm kiếm quán đang mở cửa
                            </span>
                        </div>

                        <Button className="rounded-full bg-[#E4833C] px-6 py-6 text-white">
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

            <div className="relative hidden h-[500px] md:block">
                <Image
                    src="/icons/sipnseek.png"
                    alt="Coffee drink"
                    className="object-contain"
                />
            </div>
        </main>
    )
}
