'use client'

import React, { useEffect, useState } from 'react'
import { usePlantUML } from '@/hooks/usePlantUML'

interface PlantUMLViewerProps {
    uml: string
}

const PlantUMLViewer: React.FC<PlantUMLViewerProps> = ({ uml }) => {
    const { getImageUrl, downloadDiagram, checkSyntax } = usePlantUML(uml)
    const [umlURL, setUmlURL] = useState('')
    useEffect(() => {
        const validateUML = async () => {
            const { valid, message } = await checkSyntax()
            if (!valid) {
                console.error('Invalid UML:', message)
            } else {
                setUmlURL(getImageUrl('svg'))
            }
        }
        validateUML()
    }, [])
    return (
        <div className="flex flex-col items-center space-y-4">
            {umlURL && (
                <img
                    src={umlURL}
                    alt="PlantUML Diagram"
                    className="max-w-full"
                />
            )}
            <div className="flex space-x-2">
                <button
                    onClick={() => downloadDiagram('svg')}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    Export SVG
                </button>
                <button
                    onClick={() => downloadDiagram('png')}
                    className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                    Export PNG
                </button>
            </div>
        </div>
    )
}

export default PlantUMLViewer
