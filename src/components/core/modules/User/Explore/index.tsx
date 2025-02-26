'use client'

import Selector from '@/components/core/common/Selector'
import { useGeolocation } from '@/components/layouts/GeolocationProvider'
import useCustomSWR from '@/Hooks/useCustomSWR'
import {
    checkStoreStatus,
    checkStoreStatusTriger,
} from '@/utils/checkOpenStatus'
import {
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Card,
    CardBody,
    Chip,
    Pagination,
    Select,
    SelectItem,
} from '@nextui-org/react'
import { getDistance } from 'geolib'
import {
    Search,
    ChevronDown,
    BookmarkIcon,
    Clock,
    MapPin,
    DollarSign,
    PenToolIcon,
    CatIcon,
    DogIcon,
    Coffee,
} from 'lucide-react'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ExploreModule() {
    const searchParams = useSearchParams()
    const { data } = useCustomSWR(
        `/store/get-all?${searchParams.toString() || ''}`,
    )
    console.log(data)
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        setPage(data?.body?.currentPage)
        setTotalPage(data?.body?.totalPages)
        setTotal(data?.body?.total)
    }, [data])

    const onPageChange = (page: number) => {
        setPage(page)
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set('page', page?.toString())
        window.history.pushState(null, '', `?${searchParams.toString()}`)
    }

    const { latitude: lat, longitude: lng, error } = useGeolocation()
    const handleCalculateDistance = (store: any) => {
        if (!lat || !lng) return
        const calculatedDistance = getDistance(
            {
                latitude: lat!,
                longitude: lng!,
            },
            {
                latitude: store?.addressGoogle?.latitude,
                longitude: store?.addressGoogle?.longitude,
            },
        )
        return (calculatedDistance / 1000).toFixed(2)
    }

    const { data: priceRangeData } = useCustomSWR('/prices/get')

    const { data: purposeData } = useCustomSWR('/purposes/get')

    const [searchValue, setSearchValue] = useState<string | null>(
        searchParams?.get('search') || '',
    )
    const [priceValue, setPriceValue] = useState<string | null>(
        searchParams?.get('price') || 'any',
    )
    const [purposeValue, setPurposeValue] = useState<string | null>(
        searchParams?.get('purpose') || 'any',
    )
    const [distance, setDistance] = useState<string | null>(
        searchParams?.get('distance') || 'any',
    )

    return (
        <>
            <div className="h-full w-full">
                <header className="bg-[#E39B4B] p-4">
                    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 md:flex-row md:items-center md:gap-6">
                        {/* Search */}
                        <div className="h-[56px] w-full flex-1 sm:w-1/2">
                            <Input
                                classNames={{
                                    base: 'max-w-full h-full',
                                    mainWrapper: 'h-full',
                                    input: 'text-small',
                                    inputWrapper:
                                        'h-[60px] rounded-xl sm:h-full font-normal text-default-500 bg-white',
                                }}
                                placeholder="Xung quanh bạn"
                                size="sm"
                                startContent={
                                    <Search
                                        className="text-default-400"
                                        size={16}
                                    />
                                }
                                type="search"
                                value={searchValue!}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex w-full flex-col gap-4 sm:w-1/2 sm:flex-row">
                            {purposeValue && (
                                <Select
                                    className="max-w-full sm:max-w-xs"
                                    label="Mục đích"
                                    placeholder="Lựa chọn"
                                    startContent={<Coffee />}
                                    defaultSelectedKeys={[purposeValue!]}
                                    onChange={(value) => console.log(value)}
                                >
                                    {purposeData?.body?.purposes?.map(
                                        (item: any) => (
                                            <SelectItem key={item?.value}>
                                                {item?.value}
                                            </SelectItem>
                                        ),
                                    )}
                                </Select>
                            )}
                            <Select
                                className="max-w-full sm:max-w-xs"
                                defaultSelectedKeys={[distance!]}
                                label="Khoảng cách"
                                placeholder="Lựa chọn"
                                startContent={<MapPin />}
                            >
                                <SelectItem key={"5km"}>5km</SelectItem>
                                <SelectItem key={"10km"}>10km</SelectItem>
                                <SelectItem key={"15km"}>15km</SelectItem>
                            </Select>
                            {priceValue && (
                                <Select
                                    className="max-w-full sm:max-w-xs"
                                    defaultSelectedKeys={[priceValue!]}
                                    label="Giá tiền"
                                    placeholder="Lựa chọn"
                                    startContent={<PenToolIcon />}
                                >
                                    {priceRangeData?.body?.prices?.map(
                                        (item: any) => (
                                            <SelectItem key={item?.value}>
                                                {item?.value}
                                            </SelectItem>
                                        ),
                                    )}
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* Secondary nav */}
                    {/* <div className="mx-auto mt-4 flex max-w-[1440px] items-center justify-between px-4">
                        <div className="flex gap-4">
                            <Button variant="light" className="text-white">
                                Lọc nhiều hơn
                            </Button>
                            <Button variant="light" className="text-white">
                                Đang mở cửa
                            </Button>
                        </div>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    variant="light"
                                    className="text-white"
                                    endContent={<ChevronDown />}
                                >
                                    Sắp xếp theo: Gần bạn nhất
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Sorting options">
                                <DropdownItem key={1}>
                                    Gần bạn nhất
                                </DropdownItem>
                                <DropdownItem key={2}>
                                    Đánh giá cao nhất
                                </DropdownItem>
                                <DropdownItem key={3}>
                                    Phổ biến nhất
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div> */}
                </header>
            </div>
            <div className="mx-auto min-h-screen max-w-[1440px] px-4">
                <main className="container mx-auto py-8">
                    {/* Featured section */}
                    {data?.body?.recommended?.length > 0 && (
                        <section className="mb-12">
                            <h2 className="mb-6 text-lg font-medium text-orange-500">
                                SIPNSEEK ĐỀ XUẤT
                            </h2>
                            <div className="space-y-4">
                                {data?.body?.recommended?.map(
                                    (cafe: any, i: any) => (
                                        <Card key={i} className="p-4">
                                            <CardBody className="gap-6 p-0">
                                                <div className="flex flex-wrap gap-6 lg:flex-nowrap">
                                                    <div className="relative h-48 w-full lg:w-48">
                                                        <Image
                                                            src={
                                                                cafe.thumbnail ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={cafe.storename}
                                                            fill
                                                            className="rounded-lg object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-between">
                                                        <div className="space-y-4">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="text-lg font-medium">
                                                                        {
                                                                            cafe?.storename
                                                                        }
                                                                    </h3>
                                                                    <div className="mt-2 flex items-center gap-2 text-sm text-default-500">
                                                                        <MapPin
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        {
                                                                            cafe?.addressName
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    isIconOnly
                                                                    variant="light"
                                                                    className="text-default-400"
                                                                >
                                                                    <BookmarkIcon
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                </Button>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <Chip
                                                                    variant="flat"
                                                                    color={
                                                                        checkStoreStatusTriger(
                                                                            cafe?.openTime,
                                                                            cafe?.closeTime,
                                                                        )
                                                                            ? 'success'
                                                                            : 'default'
                                                                    }
                                                                    size="sm"
                                                                    startContent={
                                                                        <Clock
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    }
                                                                >
                                                                    {checkStoreStatus(
                                                                        cafe?.openTime,
                                                                        cafe?.closeTime,
                                                                    )}
                                                                </Chip>
                                                                <Chip
                                                                    variant="flat"
                                                                    color="warning"
                                                                    size="sm"
                                                                    startContent={
                                                                        <MapPin
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    }
                                                                >
                                                                    Cách bạn{' '}
                                                                    {handleCalculateDistance(
                                                                        cafe,
                                                                    )}{' '}
                                                                    km
                                                                </Chip>
                                                                <Chip
                                                                    variant="flat"
                                                                    size="sm"
                                                                    startContent={
                                                                        <DollarSign
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    }
                                                                >
                                                                    {
                                                                        cafe
                                                                            ?.priceTag[0]
                                                                            ?.label
                                                                    }
                                                                </Chip>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 flex items-center justify-between">
                                                            <div className="text-sm text-default-500">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    {cafe?.openTime +
                                                                        ' - ' +
                                                                        cafe?.closeTime}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                color="warning"
                                                                variant="solid"
                                                                size="sm"
                                                            >
                                                                Đi thôi
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ),
                                )}
                            </div>
                        </section>
                    )}

                    {/* Regular listings */}
                    {data?.body?.related.length > 0 && (
                        <section>
                            <h2 className="mb-6 text-lg font-medium text-orange-500">
                                CÁC QUÁN KHÁC
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {data?.body?.related?.map(
                                    (cafe: any, i: number) => (
                                        <Card key={i} className="space-y-4">
                                            <div className="relative h-48">
                                                <Image
                                                    src={cafe.thumbnail}
                                                    alt="Cafe"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    className="absolute right-2 top-2 text-white"
                                                >
                                                    <BookmarkIcon size={20} />
                                                </Button>
                                            </div>
                                            <CardBody className="space-y-3">
                                                <div>
                                                    <h3 className="text-lg font-medium">
                                                        {cafe.storename}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-default-500">
                                                        {cafe.addressName}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <Chip
                                                        variant="flat"
                                                        color={
                                                            checkStoreStatusTriger(
                                                                cafe.openTime,
                                                                cafe.closeTime,
                                                            )
                                                                ? 'success'
                                                                : 'default'
                                                        }
                                                        size="sm"
                                                        startContent={
                                                            <Clock size={14} />
                                                        }
                                                    >
                                                        {checkStoreStatus(
                                                            cafe.openTime,
                                                            cafe.closeTime,
                                                        )}
                                                    </Chip>
                                                    <Chip
                                                        variant="flat"
                                                        color="warning"
                                                        size="sm"
                                                        startContent={
                                                            <MapPin size={14} />
                                                        }
                                                    >
                                                        Cách bạn{' '}
                                                        {handleCalculateDistance(
                                                            cafe,
                                                        )}
                                                        km
                                                    </Chip>
                                                </div>
                                                <div className="flex items-center text-sm text-default-500">
                                                    <Clock
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {cafe.openTime +
                                                        ' - ' +
                                                        cafe.closeTime}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ),
                                )}
                            </div>
                        </section>
                    )}

                    {/* Pagination */}
                    {data?.body?.totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                page={page}
                                total={totalPage}
                                initialPage={1}
                                color="warning"
                                showControls
                                onChange={(page) => onPageChange(page)}
                            />
                        </div>
                    )}
                </main>
            </div>
        </>
    )
}
