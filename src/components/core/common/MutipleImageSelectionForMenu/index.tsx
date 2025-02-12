import Image from 'next/image'
import { Component, ReactNode, SetStateAction, useState } from 'react'
import { CircleX, FileImage, Plus } from 'lucide-react'

interface Props {
    fileStorage: FileList
    setFileStorage: React.Dispatch<SetStateAction<FileList | null>>
}
interface State {}

class MultipleImageSelectionForMenu extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }
    shouldComponentUpdate(nextProps: Props, nextState: State) {
        if (this.props.fileStorage !== nextProps.fileStorage) {
            return true
        }
        return false
    }

    handleOnChangeSeleteFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = event.target.files
        if (files) {
            this.props.setFileStorage((prevFileStorage) => {
                if (prevFileStorage) {
                    const combinedFiles = new DataTransfer()
                    Array.from(prevFileStorage).forEach((file) =>
                        combinedFiles.items.add(file),
                    )
                    Array.from(files).forEach((file) =>
                        combinedFiles.items.add(file),
                    )
                    return combinedFiles.files
                } else {
                    return files
                }
            })
        }
    }
    removeItemFromStorage = (index: number) => {
        if (this.props.fileStorage) {
            const updatedFiles = new DataTransfer()
            Array.from(this.props.fileStorage).forEach((file, i) => {
                if (i !== index) {
                    updatedFiles.items.add(file)
                }
            })
            this.props.setFileStorage(updatedFiles.files)
        }
    }

    render(): ReactNode {
        return (
            <>
                {this.props.fileStorage?.length > 0 ? (
                    <div className="flex flex-wrap items-start gap-4">
                        <div className="grid h-[fit] w-full grid-cols-2 sm:grid-cols-6 items-center justify-start gap-2 rounded-lg  p-2 dark:bg-third">
                            {Array.from(this.props.fileStorage).map(
                                (item: File, index: number) => (
                                    <div key={index} className="relative">
                                        {item.type.includes('image') ? (
                                            <div>
                                                <Image
                                                    src={URL.createObjectURL(
                                                        item,
                                                    )}
                                                    alt="image"
                                                    width={1200}
                                                    height={1200}
                                                    className="h-[100px] w-full rounded-md object-cover"
                                                ></Image>
                                            </div>
                                        ) : (
                                            <div className="w-fit max-w-[150px] rounded-md bg-[#c4c4c4] p-3 dark:bg-black">
                                                <h3>{item.name}</h3>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className="absolute -right-1 -top-1 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-black dark:bg-white"
                                            onClick={() =>
                                                this.removeItemFromStorage(
                                                    index,
                                                )
                                            }
                                        >
                                            <CircleX className="text-white dark:text-black" />
                                        </button>
                                    </div>
                                ),
                            )}
                            <div className="h-[100px] w-full">
                                <input
                                    type="file"
                                    id="fileImporterMenu"
                                    className="hidden"
                                    onChange={this.handleOnChangeSeleteFile}
                                    multiple
                                />
                                <label htmlFor="fileImporterMenu" className="w-fit">
                                    <div className="hover:animate-wiggle flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-third dark:bg-black">
                                        <Plus className="text-[42px]" />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <input
                            type="file"
                            id="fileImporterMenu"
                            className="hidden"
                            onChange={this.handleOnChangeSeleteFile}
                            multiple
                        />
                        <div className="flex items-center gap-2 flex-col p-4">
                            <label htmlFor="fileImporterMenu">
                                <div className="hover:animate-wiggle flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-lg transition-all hover:bg-slate-100 dark:bg-black">
                                    <Plus className="text-[42px] text-third" />
                                </div>
                            </label>
                            <p className="text-sm text-gray-700">
                                Tải ảnh lên
                            </p>
                        </div>
                    </div>
                )}
            </>
        )
    }
}
export default MultipleImageSelectionForMenu
