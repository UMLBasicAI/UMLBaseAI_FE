'use client'
import { useState, useRef, useEffect } from 'react'
import {
    ZoomIn,
    ZoomOut,
    RotateCcw,
    RotateCw,
    ChevronLeft,
    ChevronRight,
    X,
    FlipVerticalIcon as Flip,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'

export interface Image {
    original: string
    index: number
}

interface ImageViewerProps {
    images: Image[]
    onClose: () => void
    open: boolean
    startIndex: number
}

const ImageViewer: React.FC<ImageViewerProps> = ({
    images = [],
    onClose,
    open,
    startIndex,
}) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex)
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [dragging, setDragging] = useState(false)
    const [startPos, setStartPos] = useState({ x: 0, y: 0 })
    const [zoomMode, setZoomMode] = useState(false)
    const [zoomState, setZoomState] = useState<'OUT' | 'IN' | null>(null)
    const [action, setAction] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const isMobile = useMediaQuery({ maxWidth: 767 })
    const imagesPerPage = isMobile ? 4 : 10
    const [flipHorizontal, setFlipHorizontal] = useState(false)
    const [flipVertical, setFlipVertical] = useState(false)

    const imgRef = useRef<HTMLImageElement>(null)

    const handleSlide = (index: number) => {
        setCurrentIndex(index)
        resetImage()
    }
    useEffect(() => {
        setCurrentIndex(startIndex)
        resetImage()
    }, [startIndex])
    useEffect(() => {
        if (!open) {
            resetImage()
        }
        return () => {
            resetImage()
        }
    }, [open])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            } else if (e.key === 'ArrowLeft') {
                handleSlide((currentIndex - 1 + images.length) % images.length)
            } else if (e.key === 'ArrowRight') {
                handleSlide((currentIndex + 1) % images.length)
            }
        }

        if (open) {
            window.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose, images, currentIndex])

    useEffect(() => {
        setCurrentPage(Math.floor(currentIndex / imagesPerPage))
    }, [currentIndex, imagesPerPage])

    const resetImage = () => {
        setZoom(1)
        setRotation(0)
        setPosition({ x: 0, y: 0 })
        setZoomMode(false)
    }

    const zoomIn = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoom >= 3 || !zoomMode) return

        const rect = imgRef.current?.getBoundingClientRect()
        if (rect) {
            const offsetX = (e.clientX - rect.left) / rect.width
            const offsetY = (e.clientY - rect.top) / rect.height

            setPosition({
                x: position.x - offsetX * 50,
                y: position.y - offsetY * 50,
            })
            setZoom((prev) => prev + 0.2)
        }
    }

    const zoomOut = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoom <= 1.5 || !zoomMode) {
            resetImage()
        } else {
            const rect = imgRef.current?.getBoundingClientRect()
            if (rect) {
                const offsetX = (e.clientX - rect.left) / rect.width
                const offsetY = (e.clientY - rect.top) / rect.height

                setPosition({
                    x: position.x + offsetX * 50,
                    y: position.y + offsetY * 50,
                })
                setZoom((prev) => prev - 0.2)
            }
        }
    }

    const rotateLeft = () => {
        setZoomMode(false)
        setZoomState(null)
        setAction('ROTATE LEFT')
        setRotation((prev) => prev - 90)
    }

    const rotateRight = () => {
        setZoomMode(false)
        setZoomState(null)
        setAction('ROTATE RIGHT')
        setRotation((prev) => prev + 90)
    }

    const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoomMode) return
        setDragging(true)
        setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const onDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!dragging || zoomMode) return
        setAction('DRAG')
        setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y })
    }

    const endDrag = () => {
        setDragging(false)
        if (zoom == 1) {
            setPosition({ x: 0, y: 0 })
        }
    }

    const handleScroll = (e: React.WheelEvent) => {
        if (e.deltaY > 0) {
            handleSlide((currentIndex + 1) % images.length)
        } else {
            handleSlide((currentIndex - 1 + images.length) % images.length)
        }
    }

    const getPaginatedThumbnails = () => {
        const start = currentPage * imagesPerPage
        const end = start + imagesPerPage
        return images.slice(start, end)
    }

    const toggleFlipHorizontal = () => {
        setZoomMode(false)
        setFlipHorizontal(!flipHorizontal)
        setAction('FLIP HORIZONTAL')
    }

    const toggleFlipVertical = () => {
        setZoomMode(false)
        setFlipVertical(!flipVertical)
        setAction('FLIP VERTICAL')
    }

    useEffect(() => {
        if (!zoomMode) {
            setAction(null)
        }
    }, [zoomMode])
    if (!open || images.length === 0) {
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        >
            <button
                className="absolute right-5 top-5 z-10 rounded-full bg-black p-0 text-white transition-all hover:bg-gray-600 sm:p-2"
                onClick={onClose}
            >
                <X size={24} />
            </button>

            <div className="absolute left-5 top-5 z-10 text-white">
                <p>
                    {'Ảnh ' + (currentIndex + 1)}/{images.length}
                </p>
            </div>
            <div className="absolute left-5 top-10 z-10 text-white">
                <p>{action}</p>
            </div>

            <div className="relative flex h-[100vh] flex-col items-center gap-4 bg-black">
                <div
                    className={`relative flex ${
                        images.length === 1 ? 'h-full' : 'h-[80vh]'
                    } w-[100vw] items-center justify-center overflow-hidden rounded-lg bg-black`}
                    onMouseMove={onDrag}
                    onMouseUp={endDrag}
                    onMouseLeave={endDrag}
                    onWheel={handleScroll}
                >
                    <button
                        className={`absolute left-2 z-10 rounded-full bg-black p-2 text-white transition-all hover:bg-gray-600 ${
                            images.length === 1 ? 'hidden' : ''
                        }`}
                        onClick={() =>
                            handleSlide(
                                (currentIndex - 1 + images.length) %
                                    images.length,
                            )
                        }
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <motion.div
                        className="cursor-grab overflow-hidden p-0 sm:p-4"
                        onMouseDown={startDrag}
                        onClick={(e) => {
                            if (zoomMode) {
                                if (zoomState === 'IN') zoomIn(e)
                                if (zoomState === 'OUT') zoomOut(e)
                            }
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentIndex}
                                ref={imgRef}
                                src={
                                    images[currentIndex]?.original ||
                                    '/placeholder.svg'
                                }
                                alt={`Image ${currentIndex + 1}`}
                                draggable={false}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: zoom,
                                    rotate: rotation,
                                    x: position.x,
                                    y: position.y,
                                    scaleX: flipHorizontal ? -1 : 1,
                                    scaleY: flipVertical ? -1 : 1,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.3 },
                                    rotate: { duration: 0.3 },
                                }}
                                style={{
                                    cursor: dragging
                                        ? 'grabbing'
                                        : zoomMode && zoomState === 'IN'
                                          ? 'zoom-in'
                                          : zoomMode && zoomState === 'OUT'
                                            ? 'zoom-out'
                                            : 'grab',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                }}
                                className={'overflow-hidden rounded-sm'}
                            />
                        </AnimatePresence>
                    </motion.div>

                    <button
                        className={`absolute right-2 rounded-full bg-black p-2 text-white transition-all hover:bg-gray-600 ${
                            images.length === 1 ? 'hidden' : ''
                        }`}
                        onClick={() =>
                            handleSlide((currentIndex + 1) % images.length)
                        }
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div
                    className={`flex gap-3 ${images.length === 1 ? 'pb-4' : ''}`}
                >
                    <button
                        onClick={() => {
                            setZoomMode(true)
                            setZoomState('IN')
                            setAction('ZOOM IN')
                            if (zoomMode && zoomState === 'IN')
                                setZoomMode(false)
                        }}
                        onDoubleClick={() => {
                            setZoom(3)
                            setZoomMode(false)
                            setZoomState(null)
                            setAction(null)
                        }}
                        className={`rounded-full ${
                            zoomState === 'IN' && zoomMode
                                ? 'bg-gray-600'
                                : 'bg-black'
                        } p-2 text-white transition-all hover:bg-gray-600`}
                    >
                        <ZoomIn />
                    </button>
                    <button
                        onClick={() => {
                            setZoomMode(true)
                            setZoomState('OUT')
                            setAction('ZOOM OUT')
                            if (zoomMode && zoomState === 'OUT')
                                setZoomMode(false)
                        }}
                        onDoubleClick={() => {
                            setZoom(1)
                            setZoomMode(false)
                            setZoomState(null)
                            setAction(null)
                        }}
                        className={`rounded-full ${
                            zoomState === 'OUT' && zoomMode
                                ? 'bg-gray-600'
                                : 'bg-black'
                        } p-2 text-white transition-all hover:bg-gray-600`}
                    >
                        <ZoomOut />
                    </button>
                    <button
                        onClick={rotateLeft}
                        className={`rounded-full p-2 text-white transition-all hover:bg-gray-600`}
                    >
                        <RotateCcw />
                    </button>
                    <button
                        onClick={rotateRight}
                        className={`rounded-full p-2 text-white transition-all hover:bg-gray-600`}
                    >
                        <RotateCw />
                    </button>
                    <button
                        onClick={toggleFlipHorizontal}
                        className={`rounded-full p-2 text-white transition-all hover:bg-gray-600`}
                    >
                        <Flip className="rotate-90" />
                    </button>
                    <button
                        onClick={toggleFlipVertical}
                        className={`rounded-full p-2 text-white transition-all hover:bg-gray-600`}
                    >
                        <Flip />
                    </button>
                </div>

                {images.length > 1 && (
                    <div className="mb-2 flex w-full flex-col items-center justify-center">
                        <motion.div
                            className="flex gap-2"
                            initial={false}
                            transition={{ duration: 0.3 }}
                            onWheel={handleScroll}
                        >
                            {getPaginatedThumbnails().map((image) => (
                                <motion.div
                                    key={image.index}
                                    className="flex-shrink-0 p-1"
                                    style={{ width: '72px', height: '72px' }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <img
                                        src={
                                            image.original || '/placeholder.svg'
                                        }
                                        alt={`Thumbnail ${image.index + 1}`}
                                        className={`h-full w-full cursor-pointer rounded-md object-cover transition-all duration-300 ease-in-out ${
                                            image.index === currentIndex
                                                ? 'scale-110 border-3 border-third'
                                                : 'border border-gray-300'
                                        }`}
                                        onClick={() => handleSlide(image.index)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                        <div className="mt-2 flex w-full justify-center px-4 md:justify-between">
                            {/* <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(0, prev - 1))
                            }
                            disabled={currentPage === 0}
                            className="rounded bg-gray-800 px-2 py-1 text-white disabled:opacity-50"
                        >
                            Previous
                        </button> */}
                            <p className="text-white">
                                {'Trang ' + (currentPage + 1)}/
                                {Math.ceil((images.length - 1) / imagesPerPage)}
                            </p>
                            {/* <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(
                                        Math.floor(
                                            (images.length - 1) / imagesPerPage,
                                        ),
                                        prev + 1,
                                    ),
                                )
                            }
                            disabled={
                                currentPage ===
                                Math.floor((images.length - 1) / imagesPerPage)
                            }
                            className="rounded bg-gray-800 px-2 py-1 text-white disabled:opacity-50"
                        >
                            Next
                        </button> */}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default ImageViewer
