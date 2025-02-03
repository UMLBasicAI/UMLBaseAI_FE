'use client'
import useCustomSWR from '@/Hooks/useCustomSWR'
import {
    Button,
    getKeyValue,
    Image,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/react'
import { Edit, Plus } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

const fetcher = (...args: [string, RequestInit]) =>
    fetch(...args).then((res) => res.json())

export default function StoresModules() {
    const [page, setPage] = React.useState(1)

    const rowsPerPage = 10
    const { data, isLoading } = useCustomSWR(
        `/store/get-all-admin?page=${page}&limit=${rowsPerPage}`,
    )

    const pages = React.useMemo(() => {
        return data?.body?.totalPages
    }, [data?.body?.totalPages, rowsPerPage])
    console.log(data)

    const loadingState =
        isLoading || data?.body?.stores.length === 0 ? 'loading' : 'idle'

    const router = useRouter()
    const pathname = usePathname()
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
                                                        className="h-16 w-20 rounded object-cover"
                                                    />
                                                ) : (
                                                    <span>No Image</span>
                                                )}
                                            </TableCell>
                                        )
                                    }
                                    if (columnKey === 'actions') {
                                        return (
                                            <TableCell>
                                                {/* Nút Edit */}
                                                <Button
                                                    size="sm"
                                                    variant="bordered"
                                                    color="primary"
                                                    // onPress={() => handleEdit(item._id)}
                                                >
                                                    <Edit size={16} />
                                                    Chỉnh sửa
                                                </Button>
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
        </div>
    )
}
