'use client'
import ImageViewer, {
    Image as IImage,
} from '@/components/core/common/ImageViewer'
import useCustomSWR from '@/Hooks/useCustomSWR'
import useCustomSwrMutation from '@/Hooks/useCustomSWRMutation'
import { parseTime } from '@internationalized/date'
import {
    Button,
    Card,
    CardBody,
    Form,
    Input,
    Select,
    SelectItem,
    TimeInput,
} from '@nextui-org/react'
import axios from 'axios'
import { ArrowLeft, Plus, XCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Circles } from 'react-loader-spinner'
import { motion } from 'framer-motion'

export default function DetailStoreModule() {
    const searchParams = useSearchParams()
    const storeId = searchParams.get('id')
    const { data: storeData, mutate: storeDataMutate } = useCustomSWR(
        '/store/get-store-by-id?id=' + storeId,
    )
    const { data: priceRangeData } = useCustomSWR('/prices/get')
    const { data: purposeData } = useCustomSWR('/purposes/get')
    const router = useRouter()
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {}

    const [isOpenImageViewer, setIsOpenImageViewer] = useState(false)
    const [toViewImages, setToViewImages] = useState<IImage[]>([])
    const [startIndex, setStartIndex] = useState(0)

    const handleViewDetailThumbnail = () => {
        if (!storeData?.body?.store?.thumbnail) return
        setToViewImages([
            {
                original: storeData?.body?.store?.thumbnail,
                index: 0,
            },
        ])
        setStartIndex(0)
        setIsOpenImageViewer(true)
    }

    const handleViewDetailMenuImages = (startIndex: number) => {
        if (!storeData?.body?.store?.menu) return
        setToViewImages(
            storeData?.body?.store?.menu?.map((item: any, index: number) => ({
                original: item?.image,
                index: index,
            })),
        )
        setStartIndex(startIndex)
        setIsOpenImageViewer(true)
    }

    const handleViewDetailImages = (startIndex: number) => {
        if (!storeData?.body?.store?.menu) return
        setToViewImages(
            storeData?.body?.store?.images?.map((item: any, index: number) => ({
                original: item?.image,
                index: index,
            })),
        )
        setStartIndex(startIndex)
        setIsOpenImageViewer(true)
    }
    const { trigger: postStoreMenu } = useCustomSwrMutation(
        '/menu/create',
        'POST',
    )
    const { trigger: updateStore } = useCustomSwrMutation(
        '/store/update-store',
        'PATCH',
    )
    const [isUploadMenu, setIsUploadMenu] = useState(false)
    const handleOnChangeSeleteFileForMenu = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files: FileList | null = event.target.files
        setIsUploadMenu(true)
        if (files) {
            const cloudinaryResponse = await handleUpdateImageMenus(files)
            const menuUploadedResponse = await postStoreMenu({
                images: cloudinaryResponse,
            })
            if (cloudinaryResponse && menuUploadedResponse) {
                const newMenuItems = menuUploadedResponse?.body?.createdMenu
                    ? menuUploadedResponse?.body?.createdMenu
                    : []

                const existingMenu = Array.isArray(storeData?.body?.store?.menu)
                    ? storeData.body.store.menu
                    : []

                const dataForUpdateStore = {
                    ...storeData?.body?.store,
                    menu: [...existingMenu, ...newMenuItems],
                }
                const updateStoreResponse =
                    await updateStore(dataForUpdateStore)

                if (updateStoreResponse?.status === 200) {
                    toast.success('Cập nhật menu ảnh thành công!')
                }
                if (updateStoreResponse?.status !== 200) {
                    toast.error('Cập nhật menu ảnh thất bại!')
                }
                storeDataMutate()
                setIsUploadMenu(false)
            }
        }
    }

    const handleUpdateImageMenus = async (
        multipleImageFileStorageForMenu: FileList | null,
    ): Promise<string[] | null> => {
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

    const { trigger: deleteMenuFromDB } = useCustomSwrMutation(
        '/menu/delete',
        'DELETE',
    )
    const { trigger: deleteStoreImages } = useCustomSwrMutation(
        '/cloudinary/find-and-delete-many',
        'DELETE',
    )
    const { trigger: deleteStoreSingleImage } = useCustomSwrMutation(
        '/cloudinary/find-and-delete',
        'DELETE',
    )

    const handleDeleteImageMenu = async (index: number, image: any) => {
        try {
            const deleteMenuResponse = await deleteMenuFromDB({
                id: image?._id,
            })
            const deleteImageCloudinary = await deleteStoreImages({
                secureUrls: [image?.image],
            })
            if (
                deleteMenuResponse?.status === 200 &&
                deleteImageCloudinary?.status == 200
            ) {
                toast.success('Xóa ảnh menu thành công!')
            }
            if (deleteMenuResponse?.status !== 200) {
            }
            storeDataMutate()
        } catch (error) {
            toast.error('Xóa ảnh menu không thành công!')
        }
    }

    const handleOnChangeSelectNewThumbnail = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file: File | null = event.target.files?.[0] ?? null
        console.log(file)
        if (file) {
            const toDeleteUrl = storeData?.body?.store?.thumbnail ?? ''
            console.log(toDeleteUrl)
            const thumbnailUrl = await handleUpdateThumbnail(file)
            if (thumbnailUrl) {
                const updateData = {
                    ...storeData?.body?.store,
                    thumbnail: thumbnailUrl,
                }
                console.log('NEW', updateData)
                const updateResponse = await updateStore(updateData)
                const deleteResponse = await deleteStoreSingleImage({
                    secureUrl: toDeleteUrl,
                })
                if (
                    updateResponse.status === 200 &&
                    deleteResponse.status == 200
                ) {
                    toast.success('Đổi ảnh đại diện thành công!')
                }
                if (updateResponse.status !== 200) {
                    toast.error('Đổi ảnh đại diện không thành công!')
                }
            }
        }
        storeDataMutate()
    }

    const handleOnClickChangeImageInput = () => {
        document.getElementById('change-thumbnail-input')?.click()
    }

    const handleUpdateThumbnail = async (
        fileStorage: File,
    ): Promise<string | null | undefined> => {
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
    const [isUploadImageGallery, setIsUploadImageGallery] = useState(false)
    const { trigger: postImageGallery } = useCustomSwrMutation(
        '/gallery/create',
        'POST',
    )
    const handleOnChangeSelectFileForImageGallery = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files: FileList | null = event.target.files
        setIsUploadImageGallery(true)
        if (files) {
            const cloudinaryResponse = await handleUpdateImageGalleries(files)
            const imageGalleryUploadResponse = await postImageGallery({
                images: cloudinaryResponse,
            })
            if (cloudinaryResponse && imageGalleryUploadResponse) {
                const newImageGalleryItems = imageGalleryUploadResponse?.body
                    ?.createdGallery
                    ? imageGalleryUploadResponse?.body?.createdGallery
                    : []

                const exstingImageGallery = Array.isArray(
                    storeData?.body?.store?.images,
                )
                    ? storeData?.body?.store?.images
                    : []

                const dataForUpdateStore = {
                    ...storeData?.body?.store,
                    images: [...exstingImageGallery, ...newImageGalleryItems],
                }
                const updateStoreResponse =
                    await updateStore(dataForUpdateStore)
                if (updateStoreResponse?.status === 200) {
                    toast.success('Cập nhật thư viện ảnh thành công!')
                }
                if (updateStoreResponse?.status !== 200) {
                    toast.error('Cập nhật thư viện ảnh thất bại!')
                }
                storeDataMutate()
                setIsUploadImageGallery(false)
            }
        }
    }

    const handleUpdateImageGalleries = async (
        multipleImageFileStorage: FileList | null,
    ): Promise<string[] | null> => {
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

    const { trigger: deleteImageGalleryFromDB } = useCustomSwrMutation(
        '/gallery/delete',
        'DELETE',
    )
    const { trigger: deleteImageGalleryFromCloud } = useCustomSwrMutation(
        '/cloudinary/find-and-delete-many',
        'DELETE',
    )

    const handleDeleteImageGallery = async (image: any) => {
        try {
            const deleteImageGalleryResponse = await deleteImageGalleryFromDB({
                id: image?._id,
            })
            const deleteImageGalleryFromCloudinary =
                await deleteImageGalleryFromCloud({
                    secureUrls: [image?.image],
                })
            if (
                deleteImageGalleryResponse?.status === 200 &&
                deleteImageGalleryFromCloudinary?.status === 200
            ) {
                toast.success('Xoá ảnh thành công!')
            }
            if (deleteImageGalleryResponse?.status !== 200) {
            }
            storeDataMutate()
        } catch (error) {
            toast.error('Xoá ảnh không thành công!')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
        >
            {storeId && (
                <div>
                    <div className="w-fullh-full flex flex-col gap-5">
                        <div className="flex flex-row justify-between">
                            <h2 className="text-xl font-bold">
                                {storeData?.body?.store?.storename.toUpperCase()}
                            </h2>
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
                            {storeData && (
                                <Card>
                                    <CardBody className="w-full p-4">
                                        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="flex flex-col gap-4">
                                                <Form
                                                    id="detail-store-form"
                                                    validationBehavior="native"
                                                    className="w-full"
                                                    onSubmit={onSubmit}
                                                >
                                                    <Input
                                                        errorMessage="Không được bỏ trống"
                                                        label="Tên cửa hàng"
                                                        labelPlacement="outside"
                                                        name="storename"
                                                        type="text"
                                                        defaultValue={
                                                            storeData?.body
                                                                ?.store
                                                                ?.storename
                                                        }
                                                    ></Input>
                                                    <Input
                                                        isReadOnly
                                                        disabled
                                                        errorMessage="Không được bỏ trống"
                                                        label="Địa chỉ (Read only)"
                                                        labelPlacement="outside"
                                                        name="addressName"
                                                        type="text"
                                                        defaultValue={
                                                            storeData?.body
                                                                ?.store
                                                                ?.addressName
                                                        }
                                                    ></Input>
                                                    <Input
                                                        isReadOnly
                                                        disabled
                                                        errorMessage="Không được bỏ trống"
                                                        label="Latitude (Read only)"
                                                        labelPlacement="outside"
                                                        name="storename"
                                                        type="text"
                                                        defaultValue={
                                                            storeData?.body
                                                                ?.store
                                                                ?.addressGoogle
                                                                ?.latitude
                                                        }
                                                    ></Input>
                                                    <Input
                                                        isReadOnly
                                                        disabled
                                                        errorMessage="Không được bỏ trống"
                                                        label="Longitude (Read only)"
                                                        labelPlacement="outside"
                                                        name="storename"
                                                        type="text"
                                                        defaultValue={
                                                            storeData?.body
                                                                ?.store
                                                                ?.addressGoogle
                                                                ?.longitude
                                                        }
                                                    ></Input>
                                                    <Input
                                                        errorMessage="Không được bỏ trống"
                                                        label="Google Map Link"
                                                        labelPlacement="outside"
                                                        name="storename"
                                                        type="text"
                                                        placeholder="(Bao gồm lat, lngt và địa chỉ)"
                                                    ></Input>
                                                    <Input
                                                        errorMessage="Không được bỏ trống"
                                                        label="Chổ đậu xe"
                                                        labelPlacement="outside"
                                                        name="parkinglot"
                                                        type="text"
                                                        defaultValue={
                                                            storeData?.body
                                                                ?.store
                                                                ?.parkinglot
                                                        }
                                                    ></Input>

                                                    <TimeInput
                                                        isRequired
                                                        errorMessage="Không được bỏ trống"
                                                        label="Giờ mở cửa"
                                                        labelPlacement="outside"
                                                        name="openTime"
                                                        defaultValue={
                                                            storeData?.body
                                                                ?.store
                                                                ?.openTime
                                                                ? parseTime(
                                                                      storeData
                                                                          .body
                                                                          .store
                                                                          .openTime,
                                                                  )
                                                                : undefined
                                                        }
                                                        className="!p-0"
                                                    />

                                                    <TimeInput
                                                        isRequired
                                                        errorMessage="Không được bỏ trống"
                                                        label="Giờ đóng cửa"
                                                        labelPlacement="outside"
                                                        name="closeTime"
                                                        defaultValue={
                                                            storeData?.body
                                                                ?.store
                                                                ?.closeTime
                                                                ? parseTime(
                                                                      storeData
                                                                          .body
                                                                          .store
                                                                          .closeTime,
                                                                  )
                                                                : undefined
                                                        }
                                                        className="!p-0"
                                                    />
                                                    <Select
                                                        isRequired
                                                        label="Loại giá (multiable)"
                                                        labelPlacement="outside"
                                                        name="priceTag"
                                                        placeholder="Chọn loại phù hợp"
                                                        selectionMode="multiple"
                                                        defaultSelectedKeys={storeData?.body?.store?.priceTag?.map(
                                                            (price: any) =>
                                                                price?._id,
                                                        )}
                                                    >
                                                        {priceRangeData?.body?.prices.map(
                                                            (price: any) => (
                                                                <SelectItem
                                                                    key={
                                                                        price?._id
                                                                    }
                                                                    value={
                                                                        price?.value
                                                                    }
                                                                >
                                                                    {
                                                                        price?.label
                                                                    }
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
                                                        defaultSelectedKeys={storeData?.body?.store?.purposeTag?.map(
                                                            (purpose: any) =>
                                                                purpose?._id,
                                                        )}
                                                    >
                                                        {purposeData?.body?.purposes.map(
                                                            (purpose: any) => (
                                                                <SelectItem
                                                                    key={
                                                                        purpose?._id
                                                                    }
                                                                    value={
                                                                        purpose?.value
                                                                    }
                                                                >
                                                                    {
                                                                        purpose?.label
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </Select>
                                                    <div className="mt-4">
                                                        <Button
                                                            className="bg-third"
                                                            onPress={() =>
                                                                alert(
                                                                    'Chưa cập nhật',
                                                                )
                                                            }
                                                        >
                                                            Cập nhật
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </div>
                                            <div className="">
                                                <div>
                                                    <p className="text-[14px]">
                                                        Ảnh đại diện
                                                    </p>
                                                    <div className="group relative mt-1 h-full w-full rounded-lg bg-gray-100 p-4">
                                                        <Image
                                                            src={
                                                                storeData?.body
                                                                    ?.store
                                                                    ?.thumbnail
                                                            }
                                                            width={1200}
                                                            height={1200}
                                                            alt="Thumbnail"
                                                            className="max-h-[200px] w-full rounded-md object-cover"
                                                        />

                                                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                            <div className="flex gap-4">
                                                                <Button
                                                                    onPress={() =>
                                                                        handleViewDetailThumbnail()
                                                                    }
                                                                >
                                                                    Xem chi tiết
                                                                </Button>
                                                                <input
                                                                    type="file"
                                                                    id="change-thumbnail-input"
                                                                    hidden
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleOnChangeSelectNewThumbnail(
                                                                            e,
                                                                        )
                                                                    }
                                                                />
                                                                <label htmlFor="change-thumbnail-input">
                                                                    <Button
                                                                        onPress={() =>
                                                                            handleOnClickChangeImageInput()
                                                                        }
                                                                    >
                                                                        Đổi ảnh
                                                                    </Button>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-[14px]">
                                                        Ảnh menu cửa hàng
                                                    </p>
                                                    <div className="relative mt-1 h-full w-full rounded-lg bg-gray-100 p-4">
                                                        <div className="grid h-fit w-full grid-cols-3 items-center justify-start gap-4 sm:grid-cols-6">
                                                            {storeData?.body?.store?.menu?.map(
                                                                (
                                                                    item: any,
                                                                    index: number,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            item?._id
                                                                        }
                                                                        className="group relative"
                                                                    >
                                                                        <Image
                                                                            src={
                                                                                item?.image
                                                                            }
                                                                            width={
                                                                                1200
                                                                            }
                                                                            height={
                                                                                1200
                                                                            }
                                                                            alt="Thumbnail"
                                                                            className="h-[100px] w-full cursor-pointer rounded-md object-cover"
                                                                        />
                                                                        <div
                                                                            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity duration-300 hover:opacity-100"
                                                                            onClick={() =>
                                                                                handleViewDetailMenuImages(
                                                                                    index,
                                                                                )
                                                                            }
                                                                        >
                                                                            <p className="text-[12px] text-white">
                                                                                Xem
                                                                            </p>
                                                                        </div>
                                                                        <div
                                                                            className="absolute -right-1 -top-1 flex cursor-pointer items-center justify-center rounded-full bg-white opacity-40 transition duration-300 hover:bg-third hover:opacity-100"
                                                                            onClick={() =>
                                                                                handleDeleteImageMenu(
                                                                                    index,
                                                                                    item,
                                                                                )
                                                                            }
                                                                        >
                                                                            <XCircle
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                            <div>
                                                                <input
                                                                    type="file"
                                                                    id="file-add-menu"
                                                                    hidden
                                                                    multiple
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleOnChangeSeleteFileForMenu(
                                                                            e,
                                                                        )
                                                                    }
                                                                />
                                                                <label htmlFor="file-add-menu">
                                                                    <div className="relative h-[100px] w-full cursor-pointer rounded-lg bg-gray-200 transition-all duration-300 hover:bg-third">
                                                                        {isUploadMenu ? (
                                                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                                                                <Circles
                                                                                    height="40"
                                                                                    width="40"
                                                                                    color="#e99b61"
                                                                                    ariaLabel="circles-loading"
                                                                                    wrapperStyle={{}}
                                                                                    wrapperClass=""
                                                                                    visible={
                                                                                        true
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        ) : (
                                                                            <Plus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[24px] text-gray-500" />
                                                                        )}
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-[14px]">
                                                        Ảnh trong cửa hàng
                                                    </p>
                                                    <div className="group relative mt-1 h-full w-full rounded-md bg-gray-100 p-4">
                                                        <div className="grid h-fit w-full grid-cols-3 items-center justify-start gap-4 sm:grid-cols-6">
                                                            {storeData?.body?.store?.images?.map(
                                                                (
                                                                    item: any,
                                                                    index: number,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            item?._id
                                                                        }
                                                                        className="group relative"
                                                                    >
                                                                        <Image
                                                                            src={
                                                                                item?.image
                                                                            }
                                                                            width={
                                                                                1200
                                                                            }
                                                                            height={
                                                                                1200
                                                                            }
                                                                            alt="Thumbnail"
                                                                            className="h-[100px] w-full cursor-pointer rounded-md object-cover"
                                                                        />
                                                                        <div
                                                                            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity duration-300 hover:opacity-100"
                                                                            onClick={() =>
                                                                                handleViewDetailImages(
                                                                                    index,
                                                                                )
                                                                            }
                                                                        >
                                                                            <p className="text-[12px] text-white">
                                                                                Xem
                                                                            </p>
                                                                        </div>
                                                                        <div
                                                                            className="absolute -right-1 -top-1 flex cursor-pointer items-center justify-center rounded-full bg-white opacity-40 transition duration-300 hover:bg-third hover:opacity-100"
                                                                            onClick={() =>
                                                                                handleDeleteImageGallery(
                                                                                    item,
                                                                                )
                                                                            }
                                                                        >
                                                                            <XCircle
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                            <div>
                                                                <input
                                                                    type="file"
                                                                    id="file-add-image-gallery"
                                                                    hidden
                                                                    multiple
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleOnChangeSelectFileForImageGallery(
                                                                            e,
                                                                        )
                                                                    }
                                                                />
                                                                <label htmlFor="file-add-image-gallery">
                                                                    <div className="relative h-[100px] w-full cursor-pointer rounded-lg bg-gray-200 transition-all duration-300 hover:bg-third">
                                                                        {isUploadImageGallery ? (
                                                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                                                                <Circles
                                                                                    height="40"
                                                                                    width="40"
                                                                                    color="#e99b61"
                                                                                    ariaLabel="circles-loading"
                                                                                    wrapperStyle={{}}
                                                                                    wrapperClass=""
                                                                                    visible={
                                                                                        true
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        ) : (
                                                                            <Plus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[24px] text-gray-500" />
                                                                        )}
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <ImageViewer
                open={isOpenImageViewer}
                onClose={() => setIsOpenImageViewer(false)}
                images={toViewImages}
                startIndex={startIndex}
                key={storeData?.body?.store?._id}
            />
        </motion.div>
    )
}
