'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePlantUML } from '@/hooks/usePlantUML'
import { Maximize2, Download } from "lucide-react"

interface PlantUMLViewerProps {
    uml: string
}

const PlantUMLViewer: React.FC<PlantUMLViewerProps> = ({ uml }) => {
    const { getImageUrl, downloadDiagram, checkSyntax } = usePlantUML(uml)
    const [umlURL, setUmlURL] = useState("")
    const [zoomLevel, setZoomLevel] = useState(1)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const imageContainerRef = useRef<HTMLDivElement>(null)
  
    // Fit image to container
    const fitImageToContainer = useCallback(() => {
      if (!imageRef.current || !containerRef.current || !imageContainerRef.current) return
  
      const containerWidth = containerRef.current.clientWidth - 32
      const containerHeight = containerRef.current.clientHeight - 32
      const imageWidth = imageRef.current.naturalWidth
      const imageHeight = imageRef.current.naturalHeight
  
      if (imageWidth === 0 || imageHeight === 0) return
      const scaleX = containerWidth / imageWidth
      const scaleY = containerHeight / imageHeight
      const scale = Math.min(scaleX, scaleY, 1)
  
      setZoomLevel(scale)
    }, [])
  
    useEffect(() => {
      const validateUML = async () => {
        const { valid, message } = await checkSyntax()
        if (!valid) {
          console.error("Invalid UML:", message)
        }
        setUmlURL(getImageUrl("svg"))
      }
      validateUML()
    }, [uml])
  
    // Handle image load to fit to container
    useEffect(() => {
      if (imageRef.current && imageRef.current.complete) {
        fitImageToContainer()
      } else if (imageRef.current) {
        const handleImageLoad = () => {
          fitImageToContainer()
        }
        imageRef.current.addEventListener("load", handleImageLoad)
        return () => {
          imageRef.current?.removeEventListener("load", handleImageLoad)
        }
      }
    }, [umlURL, fitImageToContainer])
  
    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        fitImageToContainer()
      }
  
      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }, [fitImageToContainer])
  
    useEffect(() => {
      const handleFullScreenChange = () => {
        const newFullScreenState = !!document.fullscreenElement
        setIsFullScreen(newFullScreenState)
  
        // Reset zoom when exiting fullscreen
        if (!newFullScreenState) {
          fitImageToContainer()
        }
      }
  
      document.addEventListener("fullscreenchange", handleFullScreenChange)
      return () => {
        document.removeEventListener("fullscreenchange", handleFullScreenChange)
      }
    }, [fitImageToContainer])
  
    const toggleFullScreen = async () => {
      try {
        if (!document.fullscreenElement && containerRef.current) {
          await containerRef.current.requestFullscreen()
        } else if (document.exitFullscreen) {
          await document.exitFullscreen()
        }
      } catch (err) {
        console.error("Error with fullscreen:", err)
      }
    }
  
    const handleWheel = useCallback((e: WheelEvent) => {
      e.preventDefault()
  
      // Determine zoom direction based on wheel delta
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1
  
      setZoomLevel((prevZoom) => {
        // Limit zoom between 0.1 and 3
        const newZoom = Math.max(0.1, Math.min(3, prevZoom + zoomDelta))
        return newZoom
      })
    }, [])
  
    useEffect(() => {
      const currentContainer = containerRef.current
  
      if (currentContainer) {
        currentContainer.addEventListener("wheel", handleWheel, { passive: false })
      }
  
      return () => {
        if (currentContainer) {
          currentContainer.removeEventListener("wheel", handleWheel)
        }
      }
    }, [handleWheel])
  
    return (
      <div className="flex flex-col items-center space-y-4 w-full h-full">
        <div
          ref={containerRef}
          className={`relative overflow-auto p-4 transition-all duration-300 w-full h-full ${
            isFullScreen ? "bg-white flex items-center justify-center" : "flex items-center justify-center"
          }`}
        >
          {umlURL && (
            <div ref={imageContainerRef} className="relative inline-flex items-center justify-center">
              <img
                ref={imageRef}
                src={umlURL || "/placeholder.svg"}
                alt="PlantUML Diagram"
                className="max-w-none transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                }}
                onLoad={fitImageToContainer}
              />
            </div>
          )}
  
          <div className="absolute top-2 right-2 flex space-x-2 bg-white/80 p-1 rounded shadow">
            <button
              onClick={toggleFullScreen}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
              title="Toàn màn hình"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
  
        <div className="flex space-x-2">
          <button
            onClick={() => downloadDiagram("svg")}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            SVG
          </button>
          <button
            onClick={() => downloadDiagram("png")}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            PNG
          </button>
        </div>
      </div>
    )
  }
  
  export default PlantUMLViewer
