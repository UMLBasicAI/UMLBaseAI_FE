'use client'
import useCustomSWR from '@/Hooks/useCustomSWR'
import useCustomSwrMutation from '@/Hooks/useCustomSWRMutation'
import {
    Button,
    getKeyValue,
    image,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from '@nextui-org/react'
import { s } from 'framer-motion/client'
import { CircleAlert, Delete, Edit, Plus } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const fetcher = (...args: [string, RequestInit]) =>
    fetch(...args).then((res) => res.json())

export default function StoresModules() {
    const [page, setPage] = React.useState(1)

    const rowsPerPage = 10
    const { data, isLoading, mutate } = useCustomSWR(
        `/store/get-all-admin?page=${page}&limit=${rowsPerPage}`,
    )

    const pages = React.useMemo(() => {
        return data?.body?.totalPages
    }, [data?.body?.totalPages, rowsPerPage])

    const loadingState = isLoading ? 'loading' : 'idle'

    const router = useRouter()
    const pathname = usePathname()

    const handleEdit = (id: string) => {
        router.push(pathname + '/detail?id=' + id)
    }
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const handleDelete = (id: string) => {
        onOpenChange()
    }
    const [selectedRecord, setSelectedRecord] = useState<any>()

    const { trigger: deleteStore } = useCustomSwrMutation(
        '/store/delete-store-by-id',
        'DELETE',
    )
    const { trigger: deleteStoreImages } = useCustomSwrMutation(
        '/cloudinary/find-and-delete-many',
        'DELETE',
    )
    const handleDeleteConfirm = async () => {
        try {
            const thumbnail = selectedRecord.thumbnail
            const images = selectedRecord.images
            const menu = selectedRecord.menu

            const secureUrls = new Array()
            secureUrls.push(thumbnail)
            images.map((image: any) => {
                secureUrls.push(image.image)
            })
            menu.map((image: any) => {
                secureUrls.push(image.image)
            })

            const storeDeleted = await deleteStore({
                id: selectedRecord._id,
            })

            if (storeDeleted.status !== 200) {
                toast.error('Xóa cửa hàng thất bại!')
            }

            if (storeDeleted.status === 200) {
                toast.success('Xóa cửa hàng thành công!')
            }

            if (storeDeleted.status == 200 && secureUrls.length > 0) {
                const deleteImagesResponse = await deleteStoreImages({
                    secureUrls: secureUrls,
                })
                if (deleteImagesResponse.status !== 200) {
                    toast.error('Xóa ảnh thất bại!')
                }
                toast.success('Xóa tất cả ảnh của cửa hàng thành công!')
            }
            mutate();
        } catch (error) {}
    }

    return (
        <div className="w-fullh-full flex flex-col gap-5">
            <div className="flex flex-row justify-between">
                <h2 className="text-xl font-bold">Cửa hàng</h2>
                <div>
                    <Button
                        className="bg-third"
                        variant="solid"
                        onPress={() => router.push(pathname + '/new')}
                    >
                        Thêm mới
                        <Plus size={14} />
                    </Button>
                </div>
            </div>
            <div>
                <Table
                    aria-label="Example table with client async pagination"
                    bottomContent={
                        pages > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="secondary"
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        ) : null
                    }
                >
                    <TableHeader>
                        <TableColumn key="thumbnail">Ảnh</TableColumn>
                        <TableColumn key="storename">Tên</TableColumn>
                        <TableColumn key="addressName">Địa chỉ</TableColumn>
                        <TableColumn key="openTime">Giờ mở cửa</TableColumn>
                        <TableColumn key="closeTime">Giờ đóng cửa</TableColumn>
                        <TableColumn key="actions">Thao tác</TableColumn>
                    </TableHeader>
                    <TableBody
                        emptyContent={'Không tìm thấy cửa hàng'}
                        items={data?.body?.stores ?? []}
                        loadingContent={<Spinner />}
                        loadingState={loadingState}
                    >
                        {(item: any) => (
                            <TableRow key={item?._id}>
                                {(columnKey) => {
                                    if (columnKey === 'thumbnail') {
                                        return (
                                            <TableCell>
                                                {item?.thumbnail ? (
                                                    <Image
                                                        isZoomed
                                                        src={item.thumbnail}
                                                        alt="Store Thumbnail"
                                                        radius="sm"
                                                        className="h-16 w-[100px] rounded object-cover"
                                                    />
                                                ) : (
                                                    <span>No Image</span>
                                                )}
                                            </TableCell>
                                        )
                                    }
                                    if (columnKey === 'actions') {
                                        return (
                                            <TableCell className="flex flex-row gap-2">
                                                {/* Nút Edit */}
                                                <Button
                                                    size="sm"
                                                    className="bg-third"
                                                    onPress={() =>
                                                        handleEdit(item._id)
                                                    }
                                                >
                                                    <Edit size={16} />
                                                    <span>Chỉnh sửa</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onPress={() => {
                                                        handleDelete(item._id)
                                                        setSelectedRecord(item)
                                                    }}
                                                    className=""
                                                >
                                                    <Delete size={16} />
                                                    <span>Xóa</span>
                                                </Button>
                                                {}
                                            </TableCell>
                                        )
                                    }

                                    return (
                                        <TableCell>
                                            {getKeyValue(item, columnKey)}
                                        </TableCell>
                                    )
                                }}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-2 items-center ">
                                <CircleAlert size={24} color="red" />
                                <p>Cảnh báo</p>
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    <p>
                                        Bạn thật sự muốn xóa cửa hàng{' '}
                                        <span className='font-bold'>{selectedRecord?.storename}</span>{' '}
                                        này?
                                    </p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button className="bg-third" onPress={onClose}>
                                    Hủy bỏ
                                </Button>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        handleDeleteConfirm()
                                        onClose()
                                        mutate()
                                    }}
                                >
                                    Xóa
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}
