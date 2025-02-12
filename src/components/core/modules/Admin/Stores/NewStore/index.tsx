'use client'
import MultipleImageSelectionForMenu from '@/components/core/common/MutipleImageSelectionForMenu'
import MultipleImageSelection from '@/components/core/common/MutipleImageSelection'
import useCustomSWR from '@/Hooks/useCustomSWR'
import useCustomSwrMutation from '@/Hooks/useCustomSWRMutation'
import { extractLatLng } from '@/utils/extractLatLngt'
import { extractPlaceName } from '@/utils/extractPlaceName'
import { Time } from '@internationalized/date'
import {
    Button,
    Card,
    CardBody,
    Form,
    Input,
    Select,
    SelectItem,
    Textarea,
    TimeInput,
} from '@nextui-org/react'
import axios from 'axios'
import { ArrowLeft, CircleX } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function NewStore() {
    const router = useRouter()

    const { data: priceRangeData } = useCustomSWR('/prices/get')

    const { data: purposeData } = useCustomSWR('/purposes/get')

    const [fileStorage, setFileStorage] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const handleOnChangeSeleteThumbnail = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files: File | null = event.target.files?.[0] ?? null
        if (files) {
            setFileStorage(files)
        }
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(true)
        event.dataTransfer.dropEffect = 'copy'
    }
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)
    }

    const handleDrogFile = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(true)
        const file = event.dataTransfer.files
        if (file) {
            setFileStorage(file[0])
        }
    }
    const handleBrowseFile = () => {
        document.getElementById('fileImporterThumbnail')?.click()
    }

    const handleDiscardThumbnail = () => {
        setFileStorage(null)
    }

    const [multipleImageFileStorage, setMultipleImageFileStorage] =
        useState<FileList | null>(null)
    const handleUpdateImageGalleries = async (): Promise<string[] | null> => {
        try {
            if (
                !multipleImageFileStorage ||
                multipleImageFileStorage.length === 0
            ) {
                toast.error('Chưa chọn ảnh nào cho thư viện ảnh của cửa hàng!')
                return null
            }

            const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME
            const PRESET_GALLERIES =
                process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET_GALLERIES

            const uploadPromises = Array.from(multipleImageFileStorage).map(
                async (file) => {
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('upload_preset', PRESET_GALLERIES as string)

                    const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                        formData,
                    )

                    return response.data.secure_url
                },
            )

            const imageUrls = await Promise.all(uploadPromises)
            return imageUrls
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi tải ảnh!')
            return null
        }
    }

    const handleUpdateThumbnail = async (): Promise<
        string | null | undefined
    > => {
        try {
            if (!fileStorage) {
                toast.error('Chưa chọn ảnh đại diện cho cửa hàng!')
                return null
            }
            const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME
            const PRESET_THUMBNAILS =
                process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET_THUMBNAILS
            const formData = new FormData()
            formData.append('file', fileStorage)
            formData.append('upload_preset', PRESET_THUMBNAILS as string)
            const responseData = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData,
            )
            if (responseData.status === 200) {
                const url = responseData.data.secure_url
                return url
            }
            return null
        } catch (error) {
            toast.error('Tải ảnh không thành công!')
            return null
        }
    }

    const [
        multipleImageFileStorageForMenu,
        setMultipleImageFileStorageForMenuForMenu,
    ] = useState<FileList | null>(null)

    const handleUpdateImageMenus = async (): Promise<string[] | null> => {
        try {
            if (
                !multipleImageFileStorageForMenu ||
                multipleImageFileStorageForMenu.length === 0
            ) {
                toast.error('Chưa chọn ảnh nào cho thư viện ảnh của cửa hàng!')
                return null
            }

            const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME
            const PRESET_MENU =
                process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET_MENUS

            const uploadPromises = Array.from(
                multipleImageFileStorageForMenu,
            ).map(async (file) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('upload_preset', PRESET_MENU as string)

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    formData,
                )

                return response.data.secure_url
            })

            const imageUrls = await Promise.all(uploadPromises)
            return imageUrls
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi tải ảnh!')
            return null
        }
    }

    const { trigger: postStoreGalleries } = useCustomSwrMutation(
        '/gallery/create',
        'POST',
    )
    const {trigger: postStoreMenu} = useCustomSwrMutation('/menu/create', 'POST');
    const { trigger: postStore } = useCustomSwrMutation('/store/create', 'POST');

    const [isCreateNewStoreSuccess, setIsCreateNewStoreSuccess] =
        useState(false)
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsCreateNewStoreSuccess(true)
        const data = Object.fromEntries(new FormData(e.currentTarget))
        const latLng = extractLatLng(data.addressName as string)
        const placeName = extractPlaceName(data.addressName as string)
        const thumbnailURL = (await handleUpdateThumbnail()) ?? null
        const galleriesURL = (await handleUpdateImageGalleries()) ?? null
        const menusURL = (await handleUpdateImageMenus()) ?? null
        if (thumbnailURL && galleriesURL && galleriesURL.length > 0 && menusURL) {
            const galleriesResponse = await postStoreGalleries({
                images: galleriesURL,
            })
            const menusResponse = await postStoreMenu({
                images: menusURL
            })
            const galleryIds = galleriesResponse?.body?.createdGallery.map(
                (item: any) => item._id,
            )
            const menusIds = menusResponse?.body?.createdMenu.map(
                (item: any) => item._id,
            )

            const toPostData = {
                ...data,
                addressName: placeName,
                addressGoogle: {
                    latitude: latLng?.lat,
                    longitude: latLng?.lng,
                },
                thumbnail: thumbnailURL,
                images: galleryIds,
                menu: menusIds
            }
            try {
                const storeResponse = await postStore(toPostData)
                if (storeResponse.message === 'SUCCESS') {
                    setIsCreateNewStoreSuccess(false)
                    toast.success('Tạo cửa hàng thành công!')
                    router.push('/admin/stores')
                }
            } catch (error) {
                toast.error('Tạo cửa hàng không thành công!')
                setIsCreateNewStoreSuccess(false)
            }
        }
    }

    return (
        <div className="w-fullh-full flex flex-col gap-5">
            <div className="flex flex-row justify-between">
                <h2 className="text-xl font-bold">Thêm mới cửa hàng</h2>
                <div>
                    <Button
                        className="bg-third"
                        variant="solid"
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={14} />
                        Quay lại
                    </Button>
                </div>
            </div>
            <div>
                <Card>
                    <CardBody className="w-full p-4">
                        <Form
                            id="new-store-form"
                            validationBehavior="native"
                            className="w-full"
                            onSubmit={onSubmit}
                        >
                            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                                <Input
                                    isRequired
                                    errorMessage="Không được bỏ trống"
                                    label="Tên cửa hàng"
                                    labelPlacement="outside"
                                    name="storename"
                                    placeholder="Nhập tên..."
                                    type="text"
                                />
                                <div>
                                    <Input
                                        isRequired
                                        errorMessage="Không được bỏ trống"
                                        label="Địa chỉ"
                                        labelPlacement="outside"
                                        name="addressName"
                                        placeholder="Google (copy link trong Google Map)"
                                    />
                                </div>
                                <Textarea
                                    isRequired
                                    errorMessage="Không được bỏ trống"
                                    label="Mô tả cửa hàng"
                                    labelPlacement="outside"
                                    name="description"
                                    placeholder="Nhập nội dung"
                                />
                                <Textarea
                                    disabled
                                    errorMessage="Không được bỏ trống"
                                    label="Menu (disabled)"
                                    labelPlacement="outside"
                                    name="menu"
                                    placeholder="Đổi thành thêm ảnh bên dưới!"
                                />
                                <Input
                                    isRequired
                                    errorMessage="Không được bỏ trống"
                                    label="Chổ đậu xe"
                                    labelPlacement="outside"
                                    name="parkinglot"
                                    placeholder="Nhập nội dung"
                                    type="text"
                                />
                                <Input
                                    isRequired
                                    errorMessage="Không được bỏ trống"
                                    label="Giá trung bình"
                                    labelPlacement="outside"
                                    name="avrPrice"
                                    type="number"
                                    placeholder="Nhập giá trung bình (0.000 vnd - 1.000.000.000 vnd)"
                                    min={0}
                                    max={1000000000}
                                />
                                <TimeInput
                                    isRequired
                                    errorMessage="Không được bỏ trống"
                                    label="Giờ mở cửa"
                                    labelPlacement="outside"
                                    name="openTime"
                                    defaultValue={new Time(6)}
                                    className="!p-0"
                                />
                                <TimeInput
                                    isRequired
                                    errorMessage="Không được bỏ trống"
                                    label="Giờ đóng cửa"
                                    labelPlacement="outside"
                                    name="closeTime"
                                    defaultValue={new Time(22)}
                                    className="!p-0"
                                />
                                <Select
                                    isRequired
                                    label="Loại giá (multiable)"
                                    labelPlacement="outside"
                                    name="priceTag"
                                    placeholder="Chọn loại phù hợp"
                                    selectionMode="multiple"
                                >
                                    {priceRangeData?.body?.prices.map(
                                        (price: any) => (
                                            <SelectItem
                                                key={price?._id}
                                                value={price?.value}
                                            >
                                                {price?.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </Select>
                                <Select
                                    isRequired
                                    label="Mục đích (multiable)"
                                    labelPlacement="outside"
                                    name="purposeTag"
                                    placeholder="Chọn mục đích"
                                    selectionMode="multiple"
                                >
                                    {purposeData?.body?.purposes.map(
                                        (purpose: any) => (
                                            <SelectItem
                                                key={purpose?._id}
                                                value={purpose?.value}
                                            >
                                                {purpose?.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </Select>
                            </div>
                            <div className="w-full">
                                <p className="text-sm">Ảnh cửa hàng</p>
                                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div
                                        className="max-h-[fit-content] min-h-[200px] rounded-lg border-1"
                                        onDrop={(event) => {
                                            handleDrogFile(event)
                                        }}
                                        onDragLeave={(event) => {
                                            handleDragLeave(event)
                                        }}
                                        onDragOver={(event) => {
                                            handleDragOver(event)
                                        }}
                                    >
                                        {fileStorage ? (
                                            <div className="flex justify-center p-2">
                                                <div className="relative h-fit w-fit rounded-md">
                                                    <Image
                                                        src={URL.createObjectURL(
                                                            fileStorage,
                                                        )}
                                                        alt=""
                                                        width={400}
                                                        height={400}
                                                        className="rounded-md"
                                                    />
                                                    <div className="group absolute left-0 top-0 h-full w-full rounded-md transition-all hover:bg-[rgba(0,0,0,0.5)]">
                                                        <CircleX
                                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-white opacity-0 transition-all group-hover:opacity-100"
                                                            onClick={
                                                                handleDiscardThumbnail
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex flex-col items-center justify-center gap-[16px] py-[40px]">
                                                    <div className="flex select-none flex-col items-center justify-center gap-[8px] text-center text-gray-500">
                                                        <p className="text-[14px]">
                                                            <span className="font-[600]">
                                                                Click to upload
                                                            </span>{' '}
                                                            or drag and drop
                                                        </p>
                                                        <p className="text-[12px] font-[600]">
                                                            Max. File size: 30MB
                                                        </p>
                                                        <p className="text-[12px]">
                                                            Support type: JPEG,
                                                            JPG,PNG, GIF.
                                                        </p>
                                                    </div>

                                                    <div className="">
                                                        <input
                                                            type="file"
                                                            id="fileImporterThumbnail"
                                                            className="hidden"
                                                            onChange={
                                                                handleOnChangeSeleteThumbnail
                                                            }
                                                        />
                                                        <label htmlFor="fileImporterThumbnail">
                                                            <Button
                                                                type="button"
                                                                className="bg-third"
                                                                onPress={
                                                                    handleBrowseFile
                                                                }
                                                            >
                                                                Ảnh đại diện
                                                            </Button>
                                                        </label>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="h-full">
                                        <div className="h-full w-full rounded-lg border-1">
                                            <MultipleImageSelection
                                                fileStorage={
                                                    multipleImageFileStorage!
                                                }
                                                setFileStorage={
                                                    setMultipleImageFileStorage
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <p className="text-sm">Ảnh Menu</p>
                                <div className="grid min-h-[200px] w-full grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="h-full rounded-lg border-1">
                                        <MultipleImageSelectionForMenu
                                            fileStorage={
                                                multipleImageFileStorageForMenu!
                                            }
                                            setFileStorage={
                                                setMultipleImageFileStorageForMenuForMenu
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex w-full items-center justify-end">
                                <Button
                                    type="submit"
                                    className="bg-third"
                                    isLoading={isCreateNewStoreSuccess}
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
