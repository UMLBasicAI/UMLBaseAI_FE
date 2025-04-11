'use client'

import { useState } from "react"
import PlantUMLViewer from "../UMLViewer"
import CodeMirror from '@uiw/react-codemirror'

interface CodePreviewProps {
  code: string
}

export default function CodePreview({ code }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<"preview" | "code">("code")
  const [editorCode, setEditorCode] = useState(code)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Code Preview</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("code")}
            className={`px-3 py-1 text-sm rounded-md ${viewMode === "code" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1 text-sm rounded-md ${viewMode === "preview" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">        
          <div className={`${viewMode === "code" ? "block" : "hidden"} relative`}>
            <pre className="p-4 text-sm bg-gray-900 text-gray-100 h-full ">
              <CodeMirror
                value={editorCode}
                onChange={(value) => setEditorCode(value)}
                theme="dark"
              />
            </pre>
            <button
              onClick={handleCopy}
              className="absolute p-2 text-white bg-gray-700 rounded-md top-2 right-2 hover:bg-gray-600"
              title="Copy code"
            >
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          </div>
          <div className={`${viewMode !== "code" ? "block" : "hidden"} p-4`}>
            <div className="p-4 border border-gray-200 rounded-md">
            <PlantUMLViewer uml={editorCode} key={editorCode} />
            </div>
          </div>
      </div>
    </div>
  )
}
